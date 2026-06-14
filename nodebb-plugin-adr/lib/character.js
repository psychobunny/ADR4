'use strict';

const db      = require.main.require('./src/database');
const User    = require.main.require('./src/user');
const helpers = require('./helpers');

const Character = module.exports = {};

Character.getByUid = async function (uid) {
	if (!uid) return null;
	return await db.getObject('adr:character:' + uid);
};

Character.exists = async function (uid) {
	return await db.exists('adr:character:' + uid);
};

Character.create = async function (uid, data) {
	const raceData  = await helpers.getRace(data.character_race);
	const classData = await helpers.getClass(data.character_class);
	const elemData  = await helpers.getElement(data.character_element);
	const config    = await helpers.getConfig();

	if (!raceData || !classData || !elemData) {
		throw new Error('Invalid race, class, or element selection');
	}

	const might        = parseInt(data.character_might, 10)        || 1;
	const dexterity    = parseInt(data.character_dexterity, 10)    || 1;
	const constitution = parseInt(data.character_constitution, 10) || 1;
	const intelligence = parseInt(data.character_intelligence, 10) || 1;
	const wisdom       = parseInt(data.character_wisdom, 10)       || 1;
	const charisma     = parseInt(data.character_charisma, 10)     || 1;
	const min = parseInt(config.min_characteristic, 10) || 3;
	const max = parseInt(config.max_characteristic, 10) || 20;

	for (const val of [might, dexterity, constitution, intelligence, wisdom, charisma]) {
		if (val < min || val > max) throw new Error(`Characteristics must be between ${min} and ${max}`);
	}

	const classReqs = [
		[classData.class_might_req, might, 'Might'],
		[classData.class_dexterity_req, dexterity, 'Dexterity'],
		[classData.class_constitution_req, constitution, 'Constitution'],
		[classData.class_intelligence_req, intelligence, 'Intelligence'],
		[classData.class_wisdom_req, wisdom, 'Wisdom'],
		[classData.class_charisma_req, charisma, 'Charisma'],
	];
	for (const [req, val, label] of classReqs) {
		if (req && val < req) throw new Error(`${label} must be at least ${req} for this class`);
	}

	const hp_max = parseInt(classData.class_base_hp, 10) + constitution;
	const mp_max = parseInt(classData.class_base_mp, 10) + wisdom;
	const ac     = parseInt(classData.class_base_ac, 10);

	const char = {
		uid,
		character_name:             String(data.character_name || '').trim().substring(0, 50),
		character_desc:             String(data.character_desc || '').substring(0, 500),
		character_race:             parseInt(data.character_race, 10),
		character_class:            parseInt(data.character_class, 10),
		character_alignment:        parseInt(data.character_alignment, 10) || 1,
		character_element:          parseInt(data.character_element, 10),
		character_hp:               hp_max,
		character_hp_max:           hp_max,
		character_mp:               mp_max,
		character_mp_max:           mp_max,
		character_ac:               ac,
		character_xp:               0,
		character_level:            1,
		character_might:            might,
		character_dexterity:        dexterity,
		character_constitution:     constitution,
		character_intelligence:     intelligence,
		character_wisdom:           wisdom,
		character_charisma:         charisma,
		character_birth:            Math.floor(Date.now() / 1000),
		character_gold:             100,
		character_battle_limit:     parseInt(config.character_battle_limit, 10) || 20,
		character_skill_limit:      parseInt(config.character_skill_limit, 10) || 30,
		character_trading_limit:    parseInt(config.character_trading_limit, 10) || 30,
		character_thief_limit:      parseInt(config.character_thief_limit, 10) || 10,
		character_limit_update:     Math.floor(Date.now() / 1000),
		character_sp:               0,
		character_magic_attack:     10,
		character_magic_resistance: 10,
		character_warehouse:        0,
		character_warehouse_update: 0,
		character_shop_update:      0,
		character_skill_mining:     0,
		character_skill_stone:      0,
		character_skill_forge:      0,
		character_skill_enchantment: 0,
		character_skill_trading:    0,
		character_skill_thief:      0,
		character_skill_mining_uses: 0,
		character_skill_stone_uses: 0,
		character_skill_forge_uses: 0,
		character_skill_enchantment_uses: 0,
		character_skill_trading_uses: 0,
		character_skill_thief_uses: 0,
		character_victories:        0,
		character_defeats:          0,
		character_flees:            0,
		character_victories_pvp:    0,
		character_defeats_pvp:      0,
		character_flees_pvp:        0,
		character_double_ko:        0,
		character_fp:               0,
		equip_armor:                0,
		equip_buckler:              0,
		equip_helm:                 0,
		equip_gloves:               0,
		equip_amulet:               0,
		equip_ring:                 0,
		prefs_pvp_notif_pm:         1,
		prefs_pvp_allow:            1,
		prefs_tax_pm_notify:        1,
		character_pref_give_pm:     1,
		character_pref_seller_pm:   1,
	};

	if (!char.character_name) throw new Error('Character name is required');

	await db.setObject('adr:character:' + uid, char);
	await db.sortedSetAdd('adr:characters', char.character_level, uid);

	return char;
};

Character.update = async function (uid, updates) {
	const allowed = [
		'character_name', 'character_desc', 'character_alignment',
		'prefs_pvp_notif_pm', 'prefs_pvp_allow', 'prefs_tax_pm_notify',
		'character_pref_give_pm', 'character_pref_seller_pm',
	];
	const filtered = {};
	for (const key of allowed) {
		if (updates[key] !== undefined) filtered[key] = updates[key];
	}
	await db.setObject('adr:character:' + uid, filtered);
};

Character.addGold = async function (uid, amount) {
	return await db.incrObjectFieldBy('adr:character:' + uid, 'character_gold', parseInt(amount, 10));
};

Character.deductGold = async function (uid, amount) {
	const current = parseInt(await db.getObjectField('adr:character:' + uid, 'character_gold'), 10) || 0;
	if (current < amount) throw new Error('Not enough gold');
	return await db.incrObjectFieldBy('adr:character:' + uid, 'character_gold', -parseInt(amount, 10));
};

Character.addXp = async function (uid, xp) {
	const char = await Character.getByUid(uid);
	if (!char) return;

	const newXp = parseInt(char.character_xp, 10) + parseInt(xp, 10);
	await db.setObjectField('adr:character:' + uid, 'character_xp', newXp);

	await Character.checkLevelUp(uid, { ...char, character_xp: newXp });
};

Character.checkLevelUp = async function (uid, char) {
	const classData = await helpers.getClass(char.character_class);
	if (!classData) return;

	const currentLevel = parseInt(char.character_level, 10);
	const xpReq = helpers.calcXpForNextLevel(classData, currentLevel);

	if (parseInt(char.character_xp, 10) >= xpReq) {
		const newLevel  = currentLevel + 1;
		const hpGain    = parseInt(classData.class_update_hp, 10);
		const mpGain    = parseInt(classData.class_update_mp, 10);
		const acGain    = parseInt(classData.class_update_ac, 10);
		const newHpMax  = parseInt(char.character_hp_max, 10) + hpGain;
		const newMpMax  = parseInt(char.character_mp_max, 10) + mpGain;
		const newAc     = parseInt(char.character_ac, 10) + acGain;

		await db.setObject('adr:character:' + uid, {
			character_level:  newLevel,
			character_hp:     Math.min(parseInt(char.character_hp, 10) + hpGain, newHpMax),
			character_hp_max: newHpMax,
			character_mp:     Math.min(parseInt(char.character_mp, 10) + mpGain, newMpMax),
			character_mp_max: newMpMax,
			character_ac:     newAc,
		});
		await db.sortedSetAdd('adr:characters', newLevel, uid);
	}
};

Character.heal = async function (uid, hp, mp) {
	const char = await Character.getByUid(uid);
	if (!char) return;
	const newHp = Math.min(parseInt(char.character_hp, 10) + (hp || 0), parseInt(char.character_hp_max, 10));
	const newMp = Math.min(parseInt(char.character_mp, 10) + (mp || 0), parseInt(char.character_mp_max, 10));
	await db.setObject('adr:character:' + uid, { character_hp: newHp, character_mp: newMp });
};

Character.damage = async function (uid, hp, mp) {
	const char = await Character.getByUid(uid);
	if (!char) return;
	const newHp = Math.max(0, parseInt(char.character_hp, 10) - (hp || 0));
	const newMp = Math.max(0, parseInt(char.character_mp, 10) - (mp || 0));
	await db.setObject('adr:character:' + uid, { character_hp: newHp, character_mp: newMp });
};

Character.isDead = async function (uid) {
	const hp = parseInt(await db.getObjectField('adr:character:' + uid, 'character_hp'), 10);
	return hp <= 0;
};

Character.regenLimits = async function (uid) {
	const config = await helpers.getConfig();
	if (!parseInt(config.character_limit_enable, 10)) return;

	const char = await Character.getByUid(uid);
	if (!char) return;

	const now         = Math.floor(Date.now() / 1000);
	const lastUpdate  = parseInt(char.character_limit_update, 10) || 0;
	const duration    = (parseInt(config.limit_regen_duration, 10) || 1) * 86400;

	if (now - lastUpdate >= duration) {
		await db.setObject('adr:character:' + uid, {
			character_battle_limit:   parseInt(config.character_battle_limit, 10) || 20,
			character_skill_limit:    parseInt(config.character_skill_limit, 10) || 30,
			character_trading_limit:  parseInt(config.character_trading_limit, 10) || 30,
			character_thief_limit:    parseInt(config.character_thief_limit, 10) || 10,
			character_limit_update:   now,
		});
	}
};

Character.delete = async function (uid) {
	await db.delete('adr:character:' + uid);
	await db.sortedSetRemove('adr:characters', uid);
	const itemIds = await db.getSortedSetRange('adr:items:user:' + uid, 0, -1);
	for (const id of itemIds) {
		await db.delete('adr:item:' + id);
	}
	await db.delete('adr:items:user:' + uid);
	await db.delete('adr:items:warehouse:' + uid);
};

Character.getList = async function (start, stop) {
	const uids = await db.getSortedSetRevRange('adr:characters', start, stop);
	if (!uids || !uids.length) return [];
	const chars = await db.getObjects(uids.map(uid => 'adr:character:' + uid));
	const users = await User.getUsersFields(uids, ['username', 'userslug', 'picture']);

	return chars.map((char, i) => {
		if (!char) return null;
		const user = users[i] || {};
		return {
			...char,
			username:  user.username,
			userslug:  user.userslug,
			picture:   user.picture,
		};
	}).filter(Boolean);
};

Character.getCount = async function () {
	return await db.sortedSetCard('adr:characters');
};

Character.enrichWithLookups = async function (char) {
	if (!char) return char;
	const [race, cls, elem, align] = await Promise.all([
		helpers.getRace(char.character_race),
		helpers.getClass(char.character_class),
		helpers.getElement(char.character_element),
		helpers.getAlignment(char.character_alignment),
	]);
	char.raceName      = race  ? race.race_name           : 'Unknown';
	char.className     = cls   ? cls.class_name           : 'Unknown';
	char.elementName   = elem  ? elem.element_name        : 'Unknown';
	char.elementColour = elem  ? elem.element_colour      : '#ccc';
	char.alignmentName = align ? align.alignment_name     : 'Unknown';

	const classData = cls || {};
	char.xpForNext = helpers.calcXpForNextLevel(classData, parseInt(char.character_level, 10));
	char.xpPct     = char.xpForNext > 0
		? Math.min(100, Math.round((parseInt(char.character_xp, 10) / char.xpForNext) * 100))
		: 0;
	char.hpPct = char.character_hp_max > 0
		? Math.round((parseInt(char.character_hp, 10) / parseInt(char.character_hp_max, 10)) * 100)
		: 0;
	char.mpPct = char.character_mp_max > 0
		? Math.round((parseInt(char.character_mp, 10) / parseInt(char.character_mp_max, 10)) * 100)
		: 0;
	char.isDead = parseInt(char.character_hp, 10) <= 0;
	char.age = helpers.formatDate(char.character_birth);
	return char;
};

Character.trainCharacteristic = async function (uid, stat, cost) {
	const config = await helpers.getConfig();
	const allowed = ['character_might','character_dexterity','character_constitution','character_intelligence','character_wisdom','character_charisma'];
	if (!allowed.includes(stat)) throw new Error('Invalid stat');
	const max = parseInt(config.max_characteristic, 10) || 20;
	const char = await Character.getByUid(uid);
	if (!char) throw new Error('No character');
	if (parseInt(char[stat], 10) >= max) throw new Error('Already at maximum');

	const trainingCost = cost || parseInt(config.training_charac_cost, 10) || 3000;
	await Character.deductGold(uid, trainingCost);
	await db.incrObjectField('adr:character:' + uid, stat);
};
