'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Inventory = require('./inventory');

const Skills = module.exports = {};

Skills.SKILL_FIELDS = {
	1: { field: 'character_skill_mining',      uses: 'character_skill_mining_uses',      limit: 'character_skill_limit', label: 'Mining' },
	2: { field: 'character_skill_stone',       uses: 'character_skill_stone_uses',       limit: 'character_skill_limit', label: 'Stonecraft' },
	3: { field: 'character_skill_forge',       uses: 'character_skill_forge_uses',       limit: 'character_skill_limit', label: 'Forge' },
	4: { field: 'character_skill_enchantment', uses: 'character_skill_enchantment_uses', limit: 'character_skill_limit', label: 'Enchantment' },
	5: { field: 'character_skill_trading',     uses: 'character_skill_trading_uses',     limit: 'character_trading_limit', label: 'Trading' },
	6: { field: 'character_skill_thief',       uses: 'character_skill_thief_uses',       limit: 'character_thief_limit', label: 'Thievery' },
};

Skills.getCharacterSkills = async function (uid) {
	const char   = await Character.getByUid(uid);
	const config = await helpers.getConfig();
	if (!char) return [];
	const skills = await helpers.getAllSkills();

	return skills.map(s => {
		const meta   = Skills.SKILL_FIELDS[s.skill_id];
		const level  = parseInt(char[meta.field] || 0, 10);
		const uses   = parseInt(char[meta.uses] || 0, 10);
		const limit  = parseInt(char[meta.limit] || 0, 10);
		const reqUses = parseInt(config.experience_for_new || 10, 10) * (level + 1);
		const pct    = reqUses > 0 ? Math.min(100, Math.round((uses / reqUses) * 100)) : 0;
		return {
			...s,
			level, uses, limit, reqUses, pct,
			fieldName: meta.field,
			canTrain: limit > 0,
		};
	});
};

Skills.mine = async function (uid) {
	await Character.regenLimits(uid);
	const char   = await Character.getByUid(uid);
	const config = await helpers.getConfig();
	if (!char) throw new Error('No character');
	if (parseInt(char.character_skill_limit, 10) <= 0) throw new Error('No skill uses remaining for today');

	const pickaxe = await Skills.findPickaxe(uid);
	if (!pickaxe) throw new Error('You need a pickaxe to mine ore');

	const miningLevel = parseInt(char.character_skill_mining, 10) || 0;
	const baseChance = 20 + miningLevel * 5;
	const success = helpers.rollDice(1, 100) <= baseChance;

	await db.incrObjectFieldBy('adr:character:' + uid, 'character_skill_limit', -1);
	await db.incrObjectField('adr:character:' + uid, 'character_skill_mining_uses');
	await Skills.checkSkillLevelUp(uid, 'mining');

	const newDuration = parseInt(pickaxe.item_duration, 10) - 1;
	if (newDuration <= 0) {
		await Inventory.removeItem(uid, pickaxe.item_id);
	} else {
		await db.setObjectField('adr:item:' + pickaxe.item_id, 'item_duration', newDuration);
	}

	if (!success) return { success: false, message: 'You swung the pickaxe but found nothing.' };

	const oreItemId = await db.incrObjectField('global', 'nextAdrItemId');
	const power = 1 + Math.floor(miningLevel / 5);
	const ore = {
		item_id:       oreItemId,
		item_name:     'Iron Ore',
		item_desc:     'A chunk of raw iron ore mined from the earth.',
		item_type_use: 1,
		item_quality:  3,
		item_power:    power,
		item_duration: 1, item_duration_max: 1,
		item_price:    50 * power,
		item_weight:   25,
		item_in_shop:  0, item_store_id: 0,
		item_owner_id: uid,
		item_auth:     0,
		item_max_skill: 25,
		item_add_power: 0, item_mp_use: 0,
		item_element:  0,
		item_crit_hit: 20, item_crit_hit_mod: 2,
		item_sell_back_percentage: 75,
		item_in_warehouse: 0,
		item_stolen_id: 0, item_steal_dc: 0,
		item_restrict_align_enable: 0, item_restrict_align: '0',
		item_restrict_class_enable: 0, item_restrict_class: '0',
		item_restrict_element_enable: 0, item_restrict_element: '0',
		item_restrict_race_enable: 0, item_restrict_race: '0',
		item_restrict_level: 0,
		item_bought_timestamp: Math.floor(Date.now() / 1000),
	};
	await db.setObject('adr:item:' + oreItemId, ore);
	await db.sortedSetAdd('adr:items', oreItemId, oreItemId);
	await db.sortedSetAdd('adr:items:user:' + uid, oreItemId, oreItemId);

	return { success: true, message: `You found Iron Ore (power: ${power})!`, item: ore };
};

Skills.findPickaxe = async function (uid) {
	const items = await Inventory.getUserItems(uid);
	return items.find(item => parseInt(item.item_type_use, 10) === 3) || null;
};

Skills.findTome = async function (uid) {
	const items = await Inventory.getUserItems(uid);
	return items.find(item => parseInt(item.item_type_use, 10) === 4) || null;
};

Skills.enchant = async function (uid, weaponItemId) {
	await Character.regenLimits(uid);
	const char = await Character.getByUid(uid);
	if (!char) throw new Error('No character');
	if (parseInt(char.character_skill_limit, 10) <= 0) throw new Error('No skill uses remaining');

	const weapon = await db.getObject('adr:item:' + weaponItemId);
	if (!weapon || String(weapon.item_owner_id) !== String(uid)) throw new Error('Weapon not found');
	if (parseInt(weapon.item_type_use, 10) !== 5) throw new Error('You can only enchant weapons');

	const tome = await Skills.findTome(uid);
	if (!tome) throw new Error('You need a Magic Tome to enchant items');

	const enchLevel = parseInt(char.character_skill_enchantment, 10) || 0;
	const success   = helpers.rollDice(1, 100) <= (10 + enchLevel * 5);

	await db.incrObjectFieldBy('adr:character:' + uid, 'character_skill_limit', -1);
	await db.incrObjectField('adr:character:' + uid, 'character_skill_enchantment_uses');
	await Skills.checkSkillLevelUp(uid, 'enchantment');

	const newDuration = parseInt(tome.item_duration, 10) - 1;
	if (newDuration <= 0) {
		await Inventory.removeItem(uid, tome.item_id);
	} else {
		await db.setObjectField('adr:item:' + tome.item_id, 'item_duration', newDuration);
	}

	if (!success) return { success: false, message: 'Enchantment failed. The tome was consumed.' };

	const powerGain = 1 + Math.floor(enchLevel / 3);
	await db.incrObjectFieldBy('adr:item:' + weaponItemId, 'item_power', powerGain);
	await db.setObjectField('adr:item:' + weaponItemId, 'item_type_use', 6);

	return { success: true, message: `Enchantment successful! Weapon power increased by ${powerGain}.` };
};

Skills.steal = async function (uid, targetStoreId) {
	await Character.regenLimits(uid);
	const char   = await Character.getByUid(uid);
	const config = await helpers.getConfig();
	if (!char) throw new Error('No character');
	if (!parseInt(config.thief_enable, 10)) throw new Error('Thievery is disabled');
	if (parseInt(char.character_skill_limit, 10) <= 0) throw new Error('No thief uses remaining');
	if (parseInt(char.character_thief_limit, 10) <= 0) throw new Error('No thief uses remaining');

	const jailStatus = await db.getObject('adr:jail:' + uid);
	if (jailStatus && jailStatus.user_sentence > 0) throw new Error('You cannot steal while in jail');

	const storeItems = await db.getSortedSetRange('adr:items:store:' + targetStoreId, 0, -1);
	if (!storeItems || !storeItems.length) throw new Error('Nothing to steal from this store');

	const thiefLevel = parseInt(char.character_skill_thief, 10) || 0;
	const stealChance = parseInt(config.thief_points, 10) * (1 + thiefLevel / 10);
	const success = helpers.rollDice(1, 100) <= stealChance;

	await db.incrObjectFieldBy('adr:character:' + uid, 'character_thief_limit', -1);
	await db.incrObjectField('adr:character:' + uid, 'character_skill_thief_uses');
	await Skills.checkSkillLevelUp(uid, 'thief');

	if (!success) {
		const punishType = parseInt(config.skill_thief_failure_punishment, 10) || 1;
		let penalty = '';
		if (punishType === 1) {
			const dmg = parseInt(config.skill_thief_failure_damage, 10) || 2000;
			await Character.damage(uid, dmg, 0);
			penalty = `You lost ${dmg} HP as punishment.`;
		} else {
			const goldLoss = Math.floor(parseInt(char.character_gold, 10) * 0.1);
			await Character.deductGold(uid, goldLoss);
			penalty = `You lost ${goldLoss} gold as punishment.`;
		}
		return { success: false, message: `Theft failed! ${penalty}` };
	}

	const randomIdx  = Math.floor(Math.random() * storeItems.length);
	const stolenId   = storeItems[randomIdx];
	const stolenItem = await db.getObject('adr:item:' + stolenId);
	if (!stolenItem) return { success: false, message: 'Nothing to steal.' };

	const newItemId = await db.incrObjectField('global', 'nextAdrItemId');
	const newItem = {
		...stolenItem,
		item_id:       newItemId,
		item_owner_id: uid,
		item_in_shop:  0,
		item_store_id: 0,
		item_stolen_id: stolenId,
		item_stolen_by: uid,
	};
	await db.setObject('adr:item:' + newItemId, newItem);
	await db.sortedSetAdd('adr:items', newItemId, newItemId);
	await db.sortedSetAdd('adr:items:user:' + uid, newItemId, newItemId);

	return { success: true, message: `You stole ${stolenItem.item_name}!`, item: newItem };
};

Skills.checkSkillLevelUp = async function (uid, skillKey) {
	const config = await helpers.getConfig();
	const char   = await Character.getByUid(uid);
	const fieldMap = {
		mining: { level: 'character_skill_mining', uses: 'character_skill_mining_uses' },
		stone:  { level: 'character_skill_stone', uses: 'character_skill_stone_uses' },
		forge:  { level: 'character_skill_forge', uses: 'character_skill_forge_uses' },
		enchantment: { level: 'character_skill_enchantment', uses: 'character_skill_enchantment_uses' },
		trading: { level: 'character_skill_trading', uses: 'character_skill_trading_uses' },
		thief:  { level: 'character_skill_thief', uses: 'character_skill_thief_uses' },
	};
	const meta = fieldMap[skillKey];
	if (!meta) return;

	const level   = parseInt(char[meta.level] || 0, 10);
	const uses    = parseInt(char[meta.uses] || 0, 10);
	const expReq  = parseInt(config.experience_for_new || 10, 10) * (level + 1);

	if (uses >= expReq) {
		await db.incrObjectField('adr:character:' + uid, meta.level);
	}
};

Skills.train = async function (uid, skillId, cost) {
	const config = await helpers.getConfig();
	const trainingCost = cost || parseInt(config.training_skill_cost, 10) || 1000;
	await Character.deductGold(uid, trainingCost);

	const meta = Skills.SKILL_FIELDS[skillId];
	if (!meta) throw new Error('Invalid skill');
	await db.incrObjectField('adr:character:' + uid, meta.field);
};
