'use strict';

const db = require.main.require('./src/database');

const helpers = module.exports = {};

helpers.escape = function (str) {
	if (str == null) return '';
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
};

helpers.getConfig = async function () {
	return await db.getObject('adr:config') || {};
};

helpers.getConfigField = async function (field) {
	return await db.getObjectField('adr:config', field);
};

helpers.setConfigField = async function (field, value) {
	return await db.setObjectField('adr:config', field, value);
};

helpers.getRace = async function (raceId) {
	if (!raceId) return null;
	return await db.getObject('adr:race:' + raceId);
};

helpers.getAllRaces = async function () {
	const ids = await db.getSortedSetRange('adr:races', 0, -1);
	if (!ids || !ids.length) return [];
	const races = await db.getObjects(ids.map(id => 'adr:race:' + id));
	return races.filter(Boolean);
};

helpers.getClass = async function (classId) {
	if (!classId) return null;
	return await db.getObject('adr:class:' + classId);
};

helpers.getAllClasses = async function () {
	const ids = await db.getSortedSetRange('adr:classes', 0, -1);
	if (!ids || !ids.length) return [];
	const classes = await db.getObjects(ids.map(id => 'adr:class:' + id));
	return classes.filter(Boolean);
};

helpers.getElement = async function (elementId) {
	if (!elementId) return null;
	return await db.getObject('adr:element:' + elementId);
};

helpers.getAllElements = async function () {
	const ids = await db.getSortedSetRange('adr:elements', 0, -1);
	if (!ids || !ids.length) return [];
	const elements = await db.getObjects(ids.map(id => 'adr:element:' + id));
	return elements.filter(Boolean);
};

helpers.getAlignment = async function (alignmentId) {
	if (!alignmentId) return null;
	return await db.getObject('adr:alignment:' + alignmentId);
};

helpers.getAllAlignments = async function () {
	const ids = await db.getSortedSetRange('adr:alignments', 0, -1);
	if (!ids || !ids.length) return [];
	const alignments = await db.getObjects(ids.map(id => 'adr:alignment:' + id));
	return alignments.filter(Boolean);
};

helpers.getSkill = async function (skillId) {
	if (!skillId) return null;
	return await db.getObject('adr:skill:' + skillId);
};

helpers.getAllSkills = async function () {
	const ids = await db.getSortedSetRange('adr:skills', 0, -1);
	if (!ids || !ids.length) return [];
	const skills = await db.getObjects(ids.map(id => 'adr:skill:' + id));
	return skills.filter(Boolean);
};

helpers.getMonster = async function (monsterId) {
	if (!monsterId) return null;
	return await db.getObject('adr:monster:' + monsterId);
};

helpers.getAllMonsters = async function () {
	const ids = await db.getSortedSetRange('adr:monsters', 0, -1);
	if (!ids || !ids.length) return [];
	const monsters = await db.getObjects(ids.map(id => 'adr:monster:' + id));
	return monsters.filter(Boolean);
};

helpers.getItemTypeLabel = function (typeId) {
	const types = {
		1: 'Raw Materials', 2: 'Rare Raw Materials', 3: 'Pickaxe',
		4: 'Magic Tome', 5: 'Weapon', 6: 'Enchanted Weapon',
		7: 'Armour', 8: 'Buckler', 9: 'Helm', 10: 'Gloves',
		11: 'Magic Attack Scroll', 12: 'Magic Defense Scroll',
		13: 'Amulet', 14: 'Ring', 15: 'Health Potion',
		16: 'Mana Potion', 17: 'Misc',
	};
	return types[typeId] || 'Unknown';
};

helpers.getItemQualityLabel = function (qualityId) {
	const qualities = {
		0: 'Any', 1: 'Very Poor', 2: 'Poor', 3: 'Medium',
		4: 'Good', 5: 'Very Good', 6: 'Excellent',
	};
	return qualities[qualityId] || 'Unknown';
};

helpers.isEquipmentSlot = function (typeId) {
	return [7, 8, 9, 10, 13, 14].includes(parseInt(typeId, 10));
};

helpers.isWeapon = function (typeId) {
	return [5, 6].includes(parseInt(typeId, 10));
};

helpers.calcXpForNextLevel = function (classData, level) {
	if (!classData) return 9999999;
	return Math.floor(parseInt(classData.class_update_xp_req, 10) * level);
};

helpers.calcBattleStats = async function (uid) {
	const Character  = require('./character');
	const Inventory  = require('./inventory');
	const char       = await Character.getByUid(uid);
	if (!char) return null;

	const raceData  = await helpers.getRace(char.character_race);
	const classData = await helpers.getClass(char.character_class);
	const elemData  = await helpers.getElement(char.character_element);

	let att   = parseInt(char.character_might, 10)        * 2 + parseInt(char.character_level, 10);
	let def   = parseInt(char.character_ac, 10)           + parseInt(char.character_constitution, 10);
	let magAt = parseInt(char.character_magic_attack, 10);
	let magRe = parseInt(char.character_magic_resistance, 10);

	const equippedItems = await Inventory.getEquippedItems(uid);
	for (const item of equippedItems) {
		const power = parseInt(item.item_power, 10) || 0;
		const typeId = parseInt(item.item_type_use, 10);
		if (helpers.isWeapon(typeId))        att   += power;
		else if (typeId === 7)               def   += power;
		else if (typeId === 8)               def   += Math.floor(power / 2);
		else if (typeId === 9 || typeId === 10) def += Math.floor(power / 4);
		else if (typeId === 13 || typeId === 14) {
			magAt += Math.floor(power / 2);
			magRe += Math.floor(power / 2);
		}
	}

	const weight      = await Inventory.getTotalWeight(uid);
	const raceWeight  = raceData ? (parseInt(raceData.race_weight, 10) + parseInt(raceData.race_weight_per_level, 10) * parseInt(char.character_level, 10)) : 1000;
	if (weight > raceWeight) {
		const overPct = Math.min(50, Math.floor(((weight - raceWeight) / raceWeight) * 100));
		att = Math.max(1, Math.floor(att * (100 - overPct) / 100));
		def = Math.max(0, Math.floor(def * (100 - overPct) / 100));
	}

	return {
		uid,
		hp:    parseInt(char.character_hp, 10),
		hp_max: parseInt(char.character_hp_max, 10),
		mp:    parseInt(char.character_mp, 10),
		mp_max: parseInt(char.character_mp_max, 10),
		att, def, magAt, magRe,
		element: parseInt(char.character_element, 10),
		level:   parseInt(char.character_level, 10),
	};
};

helpers.rollDice = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

helpers.calcElementDmgModifier = async function (attackerElement, defenderElement) {
	const attElem = await helpers.getElement(attackerElement);
	if (!attElem) return 100;

	const strongEl = parseInt(attElem.element_oppose_strong, 10);
	const weakEl   = parseInt(attElem.element_oppose_weak, 10);

	if (strongEl && strongEl === defenderElement)
		return parseInt(attElem.element_oppose_strong_dmg, 10);
	if (weakEl && weakEl === defenderElement)
		return parseInt(attElem.element_oppose_weak_dmg, 10);
	if (attackerElement === defenderElement)
		return parseInt(attElem.element_oppose_same_dmg, 10);
	return 100;
};

helpers.formatDate = function (ts) {
	if (!ts) return 'Never';
	return new Date(parseInt(ts, 10) * 1000).toLocaleDateString();
};

helpers.formatTimestamp = function (ts) {
	if (!ts) return 'Never';
	return new Date(parseInt(ts, 10) * 1000).toLocaleString();
};
