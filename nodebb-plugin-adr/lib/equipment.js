'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Inventory = require('./inventory');

const Equipment = module.exports = {};

Equipment.SLOT_MAP = {
	7:  'equip_armor',
	8:  'equip_buckler',
	9:  'equip_helm',
	10: 'equip_gloves',
	13: 'equip_amulet',
	14: 'equip_ring',
};

Equipment.getEquipmentView = async function (uid) {
	const char   = await Character.getByUid(uid);
	if (!char) return null;

	const slots  = {};
	for (const [typeId, slot] of Object.entries(Equipment.SLOT_MAP)) {
		const itemId = char[slot];
		if (itemId && itemId !== '0') {
			const item = await db.getObject('adr:item:' + itemId);
			slots[slot] = item ? { ...item, typeLabel: helpers.getItemTypeLabel(item.item_type_use) } : null;
		} else {
			slots[slot] = null;
		}
	}

	const weaponId = char.equip_weapon;
	let weapon = null;
	if (weaponId && weaponId !== '0') {
		weapon = await db.getObject('adr:item:' + weaponId);
	}

	const inventoryItems = await Inventory.getUserItems(uid);

	const equippable = inventoryItems.filter(item => {
		const typeId = parseInt(item.item_type_use, 10);
		return Equipment.SLOT_MAP[typeId] || helpers.isWeapon(typeId);
	}).map(item => {
		const typeId = parseInt(item.item_type_use, 10);
		const slotKey = Equipment.SLOT_MAP[typeId];
		const equipped = slotKey ? String(char[slotKey]) === String(item.item_id) : false;
		return { ...item, slotKey, equipped, isWeapon: helpers.isWeapon(typeId) };
	});

	return { char, slots, weapon, equippable, inventoryItems };
};

Equipment.equip = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');
	if (parseInt(item.item_in_warehouse, 10)) throw new Error('Item is in the warehouse');

	const typeId  = parseInt(item.item_type_use, 10);
	const slotKey = Equipment.SLOT_MAP[typeId];
	const char    = await Character.getByUid(uid);
	if (!char) throw new Error('No character');

	await Inventory.checkRestrictions(char, item);

	if (helpers.isWeapon(typeId)) {
		const currentWeaponId = char.equip_weapon;
		if (currentWeaponId && currentWeaponId !== '0') {
		}
		await db.setObjectField('adr:character:' + uid, 'equip_weapon', itemId);
		await db.setObjectField('adr:item:' + itemId, 'item_equipped', 1);
		return 'Weapon equipped.';
	} else if (slotKey) {
		const currentId = char[slotKey];
		if (currentId && currentId !== '0') {
			await db.setObjectField('adr:item:' + currentId, 'item_equipped', 0);
		}
		await db.setObjectField('adr:character:' + uid, slotKey, itemId);
		await db.setObjectField('adr:item:' + itemId, 'item_equipped', 1);
		return 'Item equipped.';
	} else {
		throw new Error('This item type cannot be equipped');
	}
};

Equipment.unequip = async function (uid, itemId) {
	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');

	const typeId  = parseInt(item.item_type_use, 10);
	const slotKey = Equipment.SLOT_MAP[typeId];
	const char    = await Character.getByUid(uid);
	if (!char) throw new Error('No character');

	if (helpers.isWeapon(typeId)) {
		if (String(char.equip_weapon) !== String(itemId)) throw new Error('Weapon not equipped');
		await db.setObjectField('adr:character:' + uid, 'equip_weapon', 0);
	} else if (slotKey) {
		if (String(char[slotKey]) !== String(itemId)) throw new Error('Item not equipped in that slot');
		await db.setObjectField('adr:character:' + uid, slotKey, 0);
	} else {
		throw new Error('This item type cannot be unequipped');
	}
	await db.setObjectField('adr:item:' + itemId, 'item_equipped', 0);
	return 'Item unequipped.';
};

Equipment.useItem = async function (uid, itemId) {
	return await Inventory.useItem(uid, itemId);
};
