'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Vault     = require('./vault');
const Cell      = require('./cell');
const Courthouse = require('./courthouse');

const Admin = module.exports = {};

Admin.getSettings = async function () {
	return await helpers.getConfig();
};

Admin.saveSettings = async function (settings) {
	const allowed = [
		'disable_rpg','battle_enable','battle_pvp_enable','battle_calc_type',
		'battle_base_exp_min','battle_base_exp_max','battle_base_exp_modifier',
		'battle_base_reward_min','battle_base_reward_max','battle_base_reward_modifier',
		'battle_base_sp_modifier','battle_monster_stats_modifier','battle_pvp_defies_max',
		'character_battle_limit','character_skill_limit','character_trading_limit','character_thief_limit',
		'character_limit_enable','limit_regen_duration','character_age',
		'allow_character_delete','allow_reroll','max_characteristic','min_characteristic',
		'experience_for_new','experience_for_reply','experience_for_edit',
		'temple_heal_cost','temple_resurrect_cost',
		'vault_enable','vault_loan_enable','loan_max_sum','loan_interests','loan_interests_time',
		'interests_rate','interests_time',
		'shop_tax','warehouse_tax','shop_duration','warehouse_duration','new_shop_price',
		'allow_shop_steal','shop_steal_min_lvl',
		'skill_thief_failure_damage','skill_thief_failure_punishment','skill_thief_failure_time','skill_thief_failure_type',
		'skill_trading_power','thief_enable','thief_points',
		'stock_use','stock_time','stock_min_change','stock_max_change',
		'cell_allow_user_blank','cell_allow_user_caution','cell_allow_user_judge',
		'cell_amount_user_blank','cell_user_judge_posts','cell_user_judge_voters',
		'next_level_penalty','training_allow_change','training_change_cost',
		'training_charac_cost','training_skill_cost','training_upgrade_cost',
		'item_power_level','item_modifier_power','weight_enable',
		'pvp_base_exp_min','pvp_base_exp_max','pvp_base_exp_modifier',
		'pvp_base_reward_min','pvp_base_reward_max','pvp_base_reward_modifier',
	];
	const filtered = {};
	for (const key of allowed) {
		if (settings[key] !== undefined) filtered[key] = settings[key];
	}
	await db.setObject('adr:config', filtered);
};

Admin.listCharacters = async function (start, stop) {
	return await Character.getList(start, stop);
};

Admin.editCharacter = async function (uid, data) {
	const char = await Character.getByUid(uid);
	if (!char) throw new Error('Character not found');

	const updates = {};
	const numFields = [
		'character_level','character_xp','character_gold','character_hp','character_hp_max',
		'character_mp','character_mp_max','character_ac','character_might','character_dexterity',
		'character_constitution','character_intelligence','character_wisdom','character_charisma',
		'character_magic_attack','character_magic_resistance','character_victories','character_defeats',
		'character_flees','character_battle_limit','character_skill_limit','character_skill_forge',
		'character_skill_mining','character_skill_stone','character_skill_enchantment',
		'character_skill_trading','character_skill_thief',
	];
	const strFields = ['character_name','character_desc'];
	const idFields  = ['character_race','character_class','character_element','character_alignment'];

	for (const f of numFields) {
		if (data[f] !== undefined) updates[f] = parseInt(data[f], 10) || 0;
	}
	for (const f of strFields) {
		if (data[f] !== undefined) updates[f] = String(data[f]).substring(0, 500);
	}
	for (const f of idFields) {
		if (data[f] !== undefined) updates[f] = parseInt(data[f], 10) || 1;
	}

	await db.setObject('adr:character:' + uid, updates);
	if (updates.character_level !== undefined) {
		await db.sortedSetAdd('adr:characters', updates.character_level, uid);
	}
};

Admin.deleteCharacter = async function (uid) {
	await Character.delete(uid);
};

Admin.listRaces = async function () {
	return await helpers.getAllRaces();
};

Admin.saveRace = async function (data) {
	let raceId = parseInt(data.race_id, 10);
	if (!raceId || raceId <= 0) {
		raceId = await db.incrObjectField('global', 'nextAdrRaceId');
		data.race_id = raceId;
	}
	await db.setObject('adr:race:' + raceId, data);
	await db.sortedSetAdd('adr:races', raceId, raceId);
	return raceId;
};

Admin.deleteRace = async function (raceId) {
	await db.delete('adr:race:' + raceId);
	await db.sortedSetRemove('adr:races', raceId);
};

Admin.listClasses = async function () {
	return await helpers.getAllClasses();
};

Admin.saveClass = async function (data) {
	let classId = parseInt(data.class_id, 10);
	if (!classId || classId <= 0) {
		classId = await db.incrObjectField('global', 'nextAdrClassId');
		data.class_id = classId;
	}
	await db.setObject('adr:class:' + classId, data);
	await db.sortedSetAdd('adr:classes', classId, classId);
	return classId;
};

Admin.deleteClass = async function (classId) {
	await db.delete('adr:class:' + classId);
	await db.sortedSetRemove('adr:classes', classId);
};

Admin.listElements = async function () {
	return await helpers.getAllElements();
};

Admin.saveElement = async function (data) {
	let elemId = parseInt(data.element_id, 10);
	if (!elemId || elemId <= 0) {
		elemId = await db.incrObjectField('global', 'nextAdrElementId');
		data.element_id = elemId;
	}
	await db.setObject('adr:element:' + elemId, data);
	await db.sortedSetAdd('adr:elements', elemId, elemId);
	return elemId;
};

Admin.deleteElement = async function (elemId) {
	await db.delete('adr:element:' + elemId);
	await db.sortedSetRemove('adr:elements', elemId);
};

Admin.listAlignments = async function () {
	return await helpers.getAllAlignments();
};

Admin.saveAlignment = async function (data) {
	let alignId = parseInt(data.alignment_id, 10);
	if (!alignId || alignId <= 0) {
		alignId = await db.incrObjectField('global', 'nextAdrAlignmentId');
		data.alignment_id = alignId;
	}
	await db.setObject('adr:alignment:' + alignId, data);
	await db.sortedSetAdd('adr:alignments', alignId, alignId);
	return alignId;
};

Admin.deleteAlignment = async function (alignId) {
	await db.delete('adr:alignment:' + alignId);
	await db.sortedSetRemove('adr:alignments', alignId);
};

Admin.listSkills = async function () {
	return await helpers.getAllSkills();
};

Admin.saveSkill = async function (data) {
	let skillId = parseInt(data.skill_id, 10);
	if (!skillId || skillId <= 0) {
		skillId = await db.incrObjectField('global', 'nextAdrSkillId');
		data.skill_id = skillId;
	}
	await db.setObject('adr:skill:' + skillId, data);
	await db.sortedSetAdd('adr:skills', skillId, skillId);
	return skillId;
};

Admin.deleteSkill = async function (skillId) {
	await db.delete('adr:skill:' + skillId);
	await db.sortedSetRemove('adr:skills', skillId);
};

Admin.listMonsters = async function () {
	return await helpers.getAllMonsters();
};

Admin.saveMonster = async function (data) {
	let monsterId = parseInt(data.monster_id, 10);
	if (!monsterId || monsterId <= 0) {
		monsterId = await db.incrObjectField('global', 'nextAdrMonsterId');
		data.monster_id = monsterId;
	}
	await db.setObject('adr:monster:' + monsterId, data);
	await db.sortedSetAdd('adr:monsters', parseInt(data.monster_level, 10) || 1, monsterId);
	return monsterId;
};

Admin.deleteMonster = async function (monsterId) {
	await db.delete('adr:monster:' + monsterId);
	await db.sortedSetRemove('adr:monsters', monsterId);
};

Admin.listItems = async function (start, stop) {
	const ids = await db.getSortedSetRange('adr:items', start || 0, stop || 49);
	if (!ids || !ids.length) return [];
	const items = await db.getObjects(ids.map(id => 'adr:item:' + id));
	return items.filter(Boolean).map(item => ({
		...item,
		typeLabel:    helpers.getItemTypeLabel(item.item_type_use),
		qualityLabel: helpers.getItemQualityLabel(item.item_quality),
	}));
};

Admin.saveItem = async function (data) {
	let itemId = parseInt(data.item_id, 10);
	if (!itemId || itemId <= 0) {
		itemId = await db.incrObjectField('global', 'nextAdrItemId');
		data.item_id = itemId;
	}
	const storeId = parseInt(data.item_store_id, 10);
	await db.setObject('adr:item:' + itemId, data);
	await db.sortedSetAdd('adr:items', itemId, itemId);
	if (storeId > 0 && parseInt(data.item_in_shop, 10)) {
		await db.sortedSetAdd('adr:items:store:' + storeId, itemId, itemId);
	}
	return itemId;
};

Admin.deleteItem = async function (itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (item) {
		const storeId = parseInt(item.item_store_id, 10);
		if (storeId) await db.sortedSetRemove('adr:items:store:' + storeId, itemId);
		if (item.item_owner_id) await db.sortedSetRemove('adr:items:user:' + item.item_owner_id, itemId);
	}
	await db.sortedSetRemove('adr:items', itemId);
	await db.delete('adr:item:' + itemId);
};

Admin.listStores = async function () {
	const ids = await db.getSortedSetRange('adr:stores', 0, -1);
	if (!ids || !ids.length) return [];
	return (await db.getObjects(ids.map(id => 'adr:store:' + id))).filter(Boolean);
};

Admin.saveStore = async function (data) {
	let storeId = parseInt(data.store_id, 10);
	if (!storeId || storeId <= 0) {
		storeId = await db.incrObjectField('global', 'nextAdrStoreId');
		data.store_id = storeId;
	}
	await db.setObject('adr:store:' + storeId, data);
	await db.sortedSetAdd('adr:stores', storeId, storeId);
	return storeId;
};

Admin.deleteStore = async function (storeId) {
	await db.delete('adr:store:' + storeId);
	await db.sortedSetRemove('adr:stores', storeId);
};

Admin.jailUser = async function (targetUid, sentence, caution, adminUid) {
	await Courthouse.adminJail(targetUid, parseInt(sentence, 10) * 3600, caution, adminUid);
};

Admin.releaseUser = async function (targetUid) {
	await Courthouse.adminRelease(targetUid);
};

Admin.listStocks = async function () {
	return await Vault.getAllStocks();
};

Admin.saveStock = async function (data) {
	let stockId = parseInt(data.stock_id, 10);
	if (!stockId || stockId <= 0) {
		stockId = await db.incrObjectField('global', 'nextAdrStockId');
		data.stock_id = stockId;
	}
	await db.setObject('adr:vault:stock:' + stockId, data);
	await db.sortedSetAdd('adr:vault:stocks', parseInt(data.stock_price, 10) || 100, stockId);
	return stockId;
};

Admin.deleteStock = async function (stockId) {
	await db.delete('adr:vault:stock:' + stockId);
	await db.sortedSetRemove('adr:vault:stocks', stockId);
};

Admin.updateStockPrices = async function () {
	await Vault.updateStockPrices();
};
