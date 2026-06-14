'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');

const Inventory = module.exports = {};

Inventory.getUserItems = async function (uid) {
	const ids = await db.getSortedSetRange('adr:items:user:' + uid, 0, -1);
	if (!ids || !ids.length) return [];
	const items = await db.getObjects(ids.map(id => 'adr:item:' + id));
	return items.filter(Boolean).map(item => ({
		...item,
		typeLabel: helpers.getItemTypeLabel(item.item_type_use),
		qualityLabel: helpers.getItemQualityLabel(item.item_quality),
		isEquipment: helpers.isEquipmentSlot(item.item_type_use) || helpers.isWeapon(item.item_type_use),
	}));
};

Inventory.getWarehouseItems = async function (uid) {
	const ids = await db.getSortedSetRange('adr:items:warehouse:' + uid, 0, -1);
	if (!ids || !ids.length) return [];
	const items = await db.getObjects(ids.map(id => 'adr:item:' + id));
	return items.filter(Boolean).map(item => ({
		...item,
		typeLabel: helpers.getItemTypeLabel(item.item_type_use),
		qualityLabel: helpers.getItemQualityLabel(item.item_quality),
	}));
};

Inventory.getEquippedItems = async function (uid) {
	const char = await Character.getByUid(uid);
	if (!char) return [];
	const slots = ['equip_armor', 'equip_buckler', 'equip_helm', 'equip_gloves', 'equip_amulet', 'equip_ring'];
	const itemIds = slots.map(s => char[s]).filter(id => id && id !== '0');
	if (!itemIds.length) return [];
	const items = await db.getObjects(itemIds.map(id => 'adr:item:' + id));
	return items.filter(Boolean);
};

Inventory.getTotalWeight = async function (uid) {
	const items = await Inventory.getUserItems(uid);
	return items.reduce((sum, item) => sum + (parseInt(item.item_weight, 10) || 0) * (parseInt(item.item_duration, 10) || 1), 0);
};

Inventory.buyFromStore = async function (uid, storeId, itemId) {
	const item  = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (parseInt(item.item_store_id, 10) !== parseInt(storeId, 10)) throw new Error('Item not in this store');
	if (!parseInt(item.item_in_shop, 10)) throw new Error('Item not available');

	const char  = await Character.getByUid(uid);
	if (!char) throw new Error('No character');

	await Inventory.checkRestrictions(char, item);

	const config = await helpers.getConfig();
	let price    = parseInt(item.item_price, 10);

	const tradingSkill = parseInt(char.character_skill_trading, 10) || 0;
	const tradingBonus = parseInt(config.skill_trading_power, 10) || 2;
	const discount = Math.min(30, Math.floor(tradingSkill / 10) * tradingBonus);
	price = Math.floor(price * (100 - discount) / 100);

	await Character.deductGold(uid, price);

	const newItemId = await db.incrObjectField('global', 'nextAdrItemId');
	const newItem   = {
		...item,
		item_id:              newItemId,
		item_owner_id:        uid,
		item_in_shop:         0,
		item_store_id:        0,
		item_in_warehouse:    0,
		item_bought_timestamp: Math.floor(Date.now() / 1000),
	};
	await db.setObject('adr:item:' + newItemId, newItem);
	await db.sortedSetAdd('adr:items', newItemId, newItemId);
	await db.sortedSetAdd('adr:items:user:' + uid, newItemId, newItemId);

	if (parseInt(config.character_trading_limit, 10) > 0) {
		await db.incrObjectFieldBy('adr:character:' + uid, 'character_trading_limit', -1);
	}

	return newItem;
};

Inventory.checkRestrictions = async function (char, item) {
	if (parseInt(item.item_restrict_level, 10) > parseInt(char.character_level, 10)) {
		throw new Error('Your level is too low for this item');
	}
	if (parseInt(item.item_restrict_class_enable, 10)) {
		const classes = String(item.item_restrict_class || '').split(',').filter(Boolean).map(Number);
		if (classes.length && !classes.includes(parseInt(char.character_class, 10))) {
			throw new Error('Your class cannot use this item');
		}
	}
	if (parseInt(item.item_restrict_race_enable, 10)) {
		const races = String(item.item_restrict_race || '').split(',').filter(Boolean).map(Number);
		if (races.length && !races.includes(parseInt(char.character_race, 10))) {
			throw new Error('Your race cannot use this item');
		}
	}
	if (parseInt(item.item_restrict_align_enable, 10)) {
		const aligns = String(item.item_restrict_align || '').split(',').filter(Boolean).map(Number);
		if (aligns.length && !aligns.includes(parseInt(char.character_alignment, 10))) {
			throw new Error('Your alignment cannot use this item');
		}
	}
	if (parseInt(item.item_restrict_element_enable, 10)) {
		const elements = String(item.item_restrict_element || '').split(',').filter(Boolean).map(Number);
		if (elements.length && !elements.includes(parseInt(char.character_element, 10))) {
			throw new Error('Your element cannot use this item');
		}
	}
	const statChecks = [
		[item.item_restrict_str, char.character_might, 'Might'],
		[item.item_restrict_dex, char.character_dexterity, 'Dexterity'],
		[item.item_restrict_con, char.character_constitution, 'Constitution'],
		[item.item_restrict_int, char.character_intelligence, 'Intelligence'],
		[item.item_restrict_wis, char.character_wisdom, 'Wisdom'],
		[item.item_restrict_cha, char.character_charisma, 'Charisma'],
	];
	for (const [req, val, label] of statChecks) {
		if (req && parseInt(req, 10) > parseInt(val, 10)) throw new Error(`Requires ${label} of at least ${req}`);
	}
};

Inventory.sellItem = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');
	if (parseInt(item.item_in_warehouse, 10)) throw new Error('Move from warehouse first');

	const sellPct = parseInt(item.item_sell_back_percentage, 10) || 50;
	const value   = Math.floor(parseInt(item.item_price, 10) * sellPct / 100);

	await Character.addGold(uid, value);
	await Inventory.removeItem(uid, itemId);

	return value;
};

Inventory.useItem = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');

	const typeId = parseInt(item.item_type_use, 10);
	const power  = parseInt(item.item_power, 10) || 0;
	let message  = '';

	if (typeId === 15) {
		await Character.heal(uid, power, 0);
		message = `Restored ${power} HP.`;
	} else if (typeId === 16) {
		await Character.heal(uid, 0, power);
		message = `Restored ${power} MP.`;
	} else if (typeId === 11) {
		await db.incrObjectFieldBy('adr:character:' + uid, 'character_magic_attack', power);
		message = `Magic attack increased by ${power}.`;
	} else if (typeId === 12) {
		await db.incrObjectFieldBy('adr:character:' + uid, 'character_magic_resistance', power);
		message = `Magic resistance increased by ${power}.`;
	} else {
		throw new Error('This item cannot be used directly');
	}

	const newDuration = parseInt(item.item_duration, 10) - 1;
	if (newDuration <= 0) {
		await Inventory.removeItem(uid, itemId);
	} else {
		await db.setObjectField('adr:item:' + itemId, 'item_duration', newDuration);
	}

	return message;
};

Inventory.dropItem = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');

	const char = await Character.getByUid(uid);
	if (char) {
		const slots = { 7: 'equip_armor', 8: 'equip_buckler', 9: 'equip_helm', 10: 'equip_gloves', 13: 'equip_amulet', 14: 'equip_ring' };
		const slot  = slots[parseInt(item.item_type_use, 10)];
		if (slot && String(char[slot]) === String(itemId)) {
			await db.setObjectField('adr:character:' + uid, slot, 0);
		}
	}

	await Inventory.removeItem(uid, itemId);
};

Inventory.removeItem = async function (uid, itemId) {
	await db.sortedSetRemove('adr:items:user:' + uid, itemId);
	await db.sortedSetRemove('adr:items:warehouse:' + uid, itemId);
	await db.sortedSetRemove('adr:items', itemId);
	await db.delete('adr:item:' + itemId);
};

Inventory.moveToWarehouse = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');
	if (parseInt(item.item_in_warehouse, 10)) throw new Error('Already in warehouse');

	const config = await helpers.getConfig();
	const warehouseCost = parseInt(config.warehouse_tax, 10) || 10;
	await Character.deductGold(uid, warehouseCost);

	await db.setObjectField('adr:item:' + itemId, 'item_in_warehouse', 1);
	await db.sortedSetRemove('adr:items:user:' + uid, itemId);
	await db.sortedSetAdd('adr:items:warehouse:' + uid, itemId, itemId);
};

Inventory.retrieveFromWarehouse = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');

	await db.setObjectField('adr:item:' + itemId, 'item_in_warehouse', 0);
	await db.sortedSetRemove('adr:items:warehouse:' + uid, itemId);
	await db.sortedSetAdd('adr:items:user:' + uid, itemId, itemId);
};

Inventory.giveItem = async function (fromUid, itemId, toUid) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(fromUid)) throw new Error('Not your item');
	if (parseInt(item.item_in_warehouse, 10)) throw new Error('Move from warehouse first');

	const char = await Character.getByUid(fromUid);
	if (char) {
		const slots = { 7: 'equip_armor', 8: 'equip_buckler', 9: 'equip_helm', 10: 'equip_gloves', 13: 'equip_amulet', 14: 'equip_ring' };
		const slot  = slots[parseInt(item.item_type_use, 10)];
		if (slot && String(char[slot]) === String(itemId)) {
			await db.setObjectField('adr:character:' + fromUid, slot, 0);
		}
	}

	await db.setObjectField('adr:item:' + itemId, 'item_owner_id', toUid);
	await db.sortedSetRemove('adr:items:user:' + fromUid, itemId);
	await db.sortedSetAdd('adr:items:user:' + toUid, itemId, itemId);
};
