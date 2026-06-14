'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Inventory = require('./inventory');

const Shops = module.exports = {};

Shops.getStores = async function () {
	const ids = await db.getSortedSetRange('adr:stores', 0, -1);
	if (!ids || !ids.length) return [];
	const stores = await db.getObjects(ids.map(id => 'adr:store:' + id));
	return stores.filter(s => s && parseInt(s.store_status, 10));
};

Shops.getStore = async function (storeId) {
	return await db.getObject('adr:store:' + storeId);
};

Shops.getStoreItems = async function (storeId) {
	const ids = await db.getSortedSetRange('adr:items:store:' + storeId, 0, -1);
	if (!ids || !ids.length) return [];
	const items = await db.getObjects(ids.map(id => 'adr:item:' + id));
	return items.filter(i => i && parseInt(i.item_in_shop, 10)).map(item => ({
		...item,
		typeLabel: helpers.getItemTypeLabel(item.item_type_use),
		qualityLabel: helpers.getItemQualityLabel(item.item_quality),
	}));
};

Shops.getAllUserShops = async function () {
	const ids = await db.getSortedSetRange('adr:shops', 0, -1);
	if (!ids || !ids.length) return [];
	const shops = await db.getObjects(ids.map(id => 'adr:shop:' + id));
	return shops.filter(Boolean);
};

Shops.getUserShop = async function (uid) {
	const shopId = await db.getObjectField('adr:shops:owner', uid);
	if (!shopId) return null;
	return await db.getObject('adr:shop:' + shopId);
};

Shops.getShop = async function (shopId) {
	return await db.getObject('adr:shop:' + shopId);
};

Shops.getShopItems = async function (shopId) {
	const ids = await db.getSortedSetRange('adr:items:shop:' + shopId, 0, -1);
	if (!ids || !ids.length) return [];
	const items = await db.getObjects(ids.map(id => 'adr:item:' + id));
	return items.filter(Boolean).map(item => ({
		...item,
		typeLabel: helpers.getItemTypeLabel(item.item_type_use),
		qualityLabel: helpers.getItemQualityLabel(item.item_quality),
	}));
};

Shops.createShop = async function (uid, data) {
	const existing = await Shops.getUserShop(uid);
	if (existing) throw new Error('You already own a shop');

	const config = await helpers.getConfig();
	const cost   = parseInt(config.new_shop_price, 10) || 500;
	await Character.deductGold(uid, cost);

	const shopId  = await db.incrObjectField('global', 'nextAdrShopId');
	const now     = Math.floor(Date.now() / 1000);
	const shop    = {
		shop_id:          shopId,
		shop_owner_id:    uid,
		shop_name:        String(data.shop_name || '').substring(0, 50),
		shop_desc:        String(data.shop_desc || '').substring(0, 255),
		shop_last_update: now,
		shop_status:      1,
	};
	await db.setObject('adr:shop:' + shopId, shop);
	await db.sortedSetAdd('adr:shops', shopId, shopId);
	await db.setObjectField('adr:shops:owner', uid, shopId);

	return shop;
};

Shops.updateShop = async function (uid, data) {
	const shop = await Shops.getUserShop(uid);
	if (!shop) throw new Error('No shop found');
	if (String(shop.shop_owner_id) !== String(uid)) throw new Error('Not your shop');

	const now = Math.floor(Date.now() / 1000);
	await db.setObject('adr:shop:' + shop.shop_id, {
		shop_name:        String(data.shop_name || shop.shop_name).substring(0, 50),
		shop_desc:        String(data.shop_desc || shop.shop_desc).substring(0, 255),
		shop_last_update: now,
	});
};

Shops.addItemToShop = async function (uid, itemId, price) {
	const shop = await Shops.getUserShop(uid);
	if (!shop) throw new Error('No shop found');

	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');
	if (parseInt(item.item_in_warehouse, 10)) throw new Error('Item is in the warehouse');

	const config  = await helpers.getConfig();
	const tax     = parseInt(config.shop_tax, 10) || 10;
	const taxCost = Math.floor(parseInt(price, 10) * tax / 100);
	await Character.deductGold(uid, taxCost);

	await db.setObject('adr:item:' + itemId, {
		item_in_shop:  1,
		item_price:    parseInt(price, 10),
		item_store_id: 0,
	});
	await db.sortedSetAdd('adr:items:shop:' + shop.shop_id, itemId, itemId);

	return { taxCost };
};

Shops.removeItemFromShop = async function (uid, itemId) {
	const shop = await Shops.getUserShop(uid);
	if (!shop) throw new Error('No shop found');

	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (String(item.item_owner_id) !== String(uid)) throw new Error('Not your item');

	await db.setObjectField('adr:item:' + itemId, 'item_in_shop', 0);
	await db.sortedSetRemove('adr:items:shop:' + shop.shop_id, itemId);
};

Shops.buyFromShop = async function (buyerUid, shopId, itemId) {
	const shop = await db.getObject('adr:shop:' + shopId);
	if (!shop) throw new Error('Shop not found');
	if (String(shop.shop_owner_id) === String(buyerUid)) throw new Error('You cannot buy from your own shop');

	const item = await db.getObject('adr:item:' + itemId);
	if (!item) throw new Error('Item not found');
	if (!parseInt(item.item_in_shop, 10)) throw new Error('Item is no longer for sale');

	const buyerChar = await Character.getByUid(buyerUid);
	if (!buyerChar) throw new Error('No character');

	await Inventory.checkRestrictions(buyerChar, item);

	const price    = parseInt(item.item_price, 10);
	const config   = await helpers.getConfig();
	const tax      = parseInt(config.shop_tax, 10) || 10;
	const sellerGets = Math.floor(price * (100 - tax) / 100);

	await Character.deductGold(buyerUid, price);
	await Character.addGold(shop.shop_owner_id, sellerGets);

	await db.setObject('adr:item:' + itemId, {
		item_owner_id: buyerUid,
		item_in_shop:  0,
	});
	await db.sortedSetRemove('adr:items:shop:' + shopId, itemId);
	await db.sortedSetRemove('adr:items:user:' + shop.shop_owner_id, itemId);
	await db.sortedSetAdd('adr:items:user:' + buyerUid, itemId, itemId);

	await db.incrObjectFieldBy('adr:character:' + buyerUid, 'character_trading_limit', -1);

	return { price, sellerGets };
};

Shops.stealFromShop = async function (thiefUid, shopId, itemId) {
	const config = await helpers.getConfig();
	if (!parseInt(config.allow_shop_steal, 10)) throw new Error('Shop stealing is disabled');

	const char = await Character.getByUid(thiefUid);
	if (!char) throw new Error('No character');

	const minLevel = parseInt(config.shop_steal_min_lvl, 10) || 5;
	if (parseInt(char.character_level, 10) < minLevel) throw new Error(`Must be level ${minLevel}+ to steal`);

	return await require('./skills').steal(thiefUid, shopId);
};
