'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');

const Temple = module.exports = {};

Temple.heal = async function (uid) {
	const char   = await Character.getByUid(uid);
	const config = await helpers.getConfig();
	if (!char) throw new Error('No character');
	if (parseInt(char.character_hp, 10) >= parseInt(char.character_hp_max, 10) &&
	    parseInt(char.character_mp, 10) >= parseInt(char.character_mp_max, 10)) {
		throw new Error('You are already at full health and mana');
	}
	if (parseInt(char.character_hp, 10) <= 0) throw new Error('You must resurrect first');

	const cost = parseInt(config.temple_heal_cost, 10) || 100;
	await Character.deductGold(uid, cost);

	await db.setObject('adr:character:' + uid, {
		character_hp: parseInt(char.character_hp_max, 10),
		character_mp: parseInt(char.character_mp_max, 10),
	});

	return { cost, hp: char.character_hp_max, mp: char.character_mp_max };
};

Temple.resurrect = async function (uid) {
	const char   = await Character.getByUid(uid);
	const config = await helpers.getConfig();
	if (!char) throw new Error('No character');
	if (parseInt(char.character_hp, 10) > 0) throw new Error('You are not dead');

	const cost = parseInt(config.temple_resurrect_cost, 10) || 300;
	await Character.deductGold(uid, cost);

	const hpRestored = Math.floor(parseInt(char.character_hp_max, 10) / 2);
	const mpRestored = Math.floor(parseInt(char.character_mp_max, 10) / 2);

	await db.setObject('adr:character:' + uid, {
		character_hp: hpRestored,
		character_mp: mpRestored,
	});

	return { cost, hp: hpRestored, mp: mpRestored };
};

Temple.getHealCost = async function (uid) {
	const config = await helpers.getConfig();
	return parseInt(config.temple_heal_cost, 10) || 100;
};

Temple.getResurrectCost = async function () {
	const config = await helpers.getConfig();
	return parseInt(config.temple_resurrect_cost, 10) || 300;
};
