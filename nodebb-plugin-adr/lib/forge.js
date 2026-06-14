'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Inventory = require('./inventory');

const Forge = module.exports = {};

Forge.getForgeView = async function (uid) {
	const char     = await Character.getByUid(uid);
	const config   = await helpers.getConfig();
	if (!char) return null;

	const items    = await Inventory.getUserItems(uid);
	const rawMats  = items.filter(i => parseInt(i.item_type_use, 10) === 1);
	const rareMats = items.filter(i => parseInt(i.item_type_use, 10) === 2);
	const weapons  = items.filter(i => parseInt(i.item_type_use, 10) === 5);

	return {
		char,
		rawMats, rareMats, weapons,
		forgeLevel:  parseInt(char.character_skill_forge, 10) || 0,
		forgeLimit:  parseInt(char.character_skill_limit, 10) || 0,
		trainingCost: parseInt(config.training_skill_cost, 10) || 1000,
	};
};

Forge.forgeWeapon = async function (uid, mat1Id, mat2Id) {
	await Character.regenLimits(uid);
	const char = await Character.getByUid(uid);
	if (!char) throw new Error('No character');
	if (parseInt(char.character_skill_limit, 10) <= 0) throw new Error('No skill uses remaining');
	if (parseInt(char.character_skill_forge, 10) < 1) throw new Error('You need at least Forge level 1');

	const mat1 = await db.getObject('adr:item:' + mat1Id);
	const mat2 = mat2Id ? await db.getObject('adr:item:' + mat2Id) : null;

	if (!mat1 || String(mat1.item_owner_id) !== String(uid)) throw new Error('Material not found');
	if (![1, 2].includes(parseInt(mat1.item_type_use, 10))) throw new Error('First material must be a raw material');

	if (mat2 && String(mat2.item_owner_id) !== String(uid)) throw new Error('Second material not found');
	if (mat2 && ![1, 2].includes(parseInt(mat2.item_type_use, 10))) throw new Error('Second material must be a raw material');

	const forgeLevel = parseInt(char.character_skill_forge, 10);
	const basePower  = parseInt(mat1.item_power, 10) + (mat2 ? parseInt(mat2.item_power, 10) : 0);
	const chance     = 30 + forgeLevel * 5;
	const success    = helpers.rollDice(1, 100) <= chance;

	await db.incrObjectFieldBy('adr:character:' + uid, 'character_skill_limit', -1);
	await db.incrObjectField('adr:character:' + uid, 'character_skill_forge_uses');
	await require('./skills').checkSkillLevelUp(uid, 'forge');

	await Inventory.removeItem(uid, mat1Id);
	if (mat2) await Inventory.removeItem(uid, mat2Id);

	if (!success) {
		return { success: false, message: 'The forge failed. Your materials were consumed.' };
	}

	const weaponPower = Math.max(1, Math.floor(basePower * (0.8 + Math.random() * 0.4)));
	const quality     = Math.min(6, Math.max(1, forgeLevel));
	const weaponName  = mat2 ? 'Alloy Weapon' : 'Forged Weapon';

	const newItemId = await db.incrObjectField('global', 'nextAdrItemId');
	const weapon    = {
		item_id:       newItemId,
		item_name:     weaponName,
		item_desc:     `Forged from raw materials. Power: ${weaponPower}`,
		item_type_use: 5,
		item_quality:  quality,
		item_power:    weaponPower,
		item_duration: 100 + forgeLevel * 10,
		item_duration_max: 100 + forgeLevel * 10,
		item_price:    weaponPower * 50,
		item_weight:   15,
		item_in_shop:  0, item_store_id: 0,
		item_owner_id: uid,
		item_auth:     0,
		item_max_skill: 20,
		item_add_power: 0, item_mp_use: 0, item_element: 0,
		item_crit_hit: 20, item_crit_hit_mod: 2,
		item_sell_back_percentage: 75,
		item_in_warehouse: 0,
		item_stolen_id: 0, item_steal_dc: 0,
		item_restrict_align_enable: 0, item_restrict_align: '0',
		item_restrict_class_enable: 0, item_restrict_class: '0',
		item_restrict_element_enable: 0, item_restrict_element: '0',
		item_restrict_race_enable: 0, item_restrict_race: '0',
		item_restrict_level: Math.max(0, forgeLevel - 1),
		item_bought_timestamp: Math.floor(Date.now() / 1000),
	};
	await db.setObject('adr:item:' + newItemId, weapon);
	await db.sortedSetAdd('adr:items', newItemId, newItemId);
	await db.sortedSetAdd('adr:items:user:' + uid, newItemId, newItemId);

	return { success: true, message: `Forged ${weaponName} with power ${weaponPower}!`, item: weapon };
};

Forge.trainForge = async function (uid) {
	const config = await helpers.getConfig();
	const cost   = parseInt(config.training_skill_cost, 10) || 1000;
	return await require('./skills').train(uid, 3, cost);
};
