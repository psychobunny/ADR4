'use strict';

const nconf     = require.main.require('nconf');
const helpers   = require('./helpers');
const Character = require('./character');
const Battle    = require('./battle');
const BattlePvp = require('./battle-pvp');
const Inventory = require('./inventory');
const Equipment = require('./equipment');
const Skills    = require('./skills');
const Shops     = require('./shops');
const Temple    = require('./temple');
const Vault     = require('./vault');
const Cell      = require('./cell');
const Courthouse = require('./courthouse');
const Forge     = require('./forge');
const Admin     = require('./admin');
const mw        = require('./middleware');

const basePath = nconf.get('relative_path') || '';

const routes = module.exports = {};

routes.init = function (router, middleware) {
	const authMw = [middleware.authenticate || ((req, res, next) => next()), mw.requireLogin];
	const charMw = [...authMw, mw.requireCharacter];

	router.get  ('/adr',                         charMw, routes.town);
	router.get  ('/adr/town',                    charMw, routes.town);
	router.get  ('/adr/character/create',        authMw, routes.characterCreateGet);
	router.post ('/adr/character/create',        authMw, routes.characterCreatePost);
	router.get  ('/adr/character/:uid',          routes.characterView);
	router.get  ('/adr/character',               charMw, routes.characterSelf);
	router.get  ('/adr/character-edit',          charMw, routes.characterEditGet);
	router.post ('/adr/character-edit',          charMw, routes.characterEditPost);
	router.post ('/adr/character/delete',        charMw, routes.characterDelete);
	router.get  ('/adr/character-list',          routes.characterList);

	router.get  ('/adr/battle',                  [...charMw, mw.notDead, mw.notJailed], routes.battleGet);
	router.post ('/adr/battle/start',            [...charMw, mw.notDead, mw.notJailed], routes.battleStart);
	router.post ('/adr/battle/action',           [...charMw, mw.notDead], routes.battleAction);
	router.post ('/adr/battle/flee',             [...charMw], routes.battleFlee);
	router.get  ('/adr/battle/result/:battleId', charMw, routes.battleResult);
	router.get  ('/adr/battle/history',          charMw, routes.battleHistory);
	router.get  ('/adr/battle/community',        routes.battleCommunity);

	router.get  ('/adr/pvp',                     charMw, routes.pvpGet);
	router.post ('/adr/pvp/challenge',           [...charMw, mw.notDead, mw.notJailed], routes.pvpChallenge);
	router.post ('/adr/pvp/accept',              [...charMw, mw.notDead], routes.pvpAccept);
	router.post ('/adr/pvp/decline',             charMw, routes.pvpDecline);
	router.get  ('/adr/pvp/history',             charMw, routes.pvpHistory);

	router.get  ('/adr/inventory',               charMw, routes.inventoryGet);
	router.post ('/adr/inventory/sell',          charMw, routes.inventorySell);
	router.post ('/adr/inventory/use',           charMw, routes.inventoryUse);
	router.post ('/adr/inventory/drop',          charMw, routes.inventoryDrop);
	router.post ('/adr/inventory/warehouse',     charMw, routes.inventoryWarehouse);
	router.post ('/adr/inventory/retrieve',      charMw, routes.inventoryRetrieve);
	router.post ('/adr/inventory/give',          charMw, routes.inventoryGive);

	router.get  ('/adr/equipment',               charMw, routes.equipmentGet);
	router.post ('/adr/equipment/equip',         charMw, routes.equipmentEquip);
	router.post ('/adr/equipment/unequip',       charMw, routes.equipmentUnequip);

	router.get  ('/adr/skills',                  charMw, routes.skillsGet);
	router.post ('/adr/skills/train',            charMw, routes.skillsTrain);

	router.get  ('/adr/shops',                   charMw, routes.shopsGet);
	router.get  ('/adr/shops/store/:storeId',    charMw, routes.storeView);
	router.post ('/adr/shops/buy/store',         [...charMw, mw.notDead, mw.notJailed], routes.storeBuy);
	router.get  ('/adr/shops/user/:shopId',      charMw, routes.shopView);
	router.post ('/adr/shops/buy/shop',          [...charMw, mw.notDead, mw.notJailed], routes.shopBuy);
	router.get  ('/adr/shops/manage',            charMw, routes.shopManageGet);
	router.post ('/adr/shops/manage/create',     charMw, routes.shopCreate);
	router.post ('/adr/shops/manage/update',     charMw, routes.shopUpdate);
	router.post ('/adr/shops/manage/add-item',   charMw, routes.shopAddItem);
	router.post ('/adr/shops/manage/remove-item',charMw, routes.shopRemoveItem);

	router.get  ('/adr/temple',                  charMw, routes.templeGet);
	router.post ('/adr/temple/heal',             charMw, routes.templeHeal);
	router.post ('/adr/temple/resurrect',        charMw, routes.templeResurrect);

	router.get  ('/adr/vault',                   charMw, routes.vaultGet);
	router.post ('/adr/vault/deposit',           charMw, routes.vaultDeposit);
	router.post ('/adr/vault/withdraw',          charMw, routes.vaultWithdraw);
	router.post ('/adr/vault/loan',              charMw, routes.vaultLoan);
	router.post ('/adr/vault/repay',             charMw, routes.vaultRepay);
	router.post ('/adr/vault/stock/buy',         charMw, routes.vaultStockBuy);
	router.post ('/adr/vault/stock/sell',        charMw, routes.vaultStockSell);

	router.get  ('/adr/cell',                    charMw, routes.cellGet);
	router.post ('/adr/cell/buy-freedom',        charMw, routes.cellBuyFreedom);

	router.get  ('/adr/courthouse',              charMw, routes.courthouseGet);
	router.post ('/adr/courthouse/vote',         charMw, routes.courthouseVote);

	router.get  ('/adr/forge',                   [...charMw, mw.notDead, mw.notJailed], routes.forgeGet);
	router.post ('/adr/forge/weapon',            [...charMw, mw.notDead, mw.notJailed], routes.forgeWeapon);
	router.post ('/adr/forge/mine',              [...charMw, mw.notDead, mw.notJailed], routes.forgeMine);
	router.post ('/adr/forge/enchant',           [...charMw, mw.notDead, mw.notJailed], routes.forgeEnchant);

	router.get  ('/adr/faq',                     routes.faqGet);
	router.get  ('/adr/copyright',               routes.copyrightGet);

	const adminMw = [middleware.authenticate || ((req, res, next) => next()), mw.requireLogin, mw.requireAdmin];
	router.get  ('/admin/plugins/adr',                  adminMw, routes.adminIndex);
	router.get  ('/admin/plugins/adr/settings',         adminMw, routes.adminSettingsGet);
	router.post ('/admin/plugins/adr/settings',         adminMw, routes.adminSettingsSave);
	router.get  ('/admin/plugins/adr/characters',       adminMw, routes.adminCharacters);
	router.post ('/admin/plugins/adr/characters/edit',  adminMw, routes.adminCharacterEdit);
	router.post ('/admin/plugins/adr/characters/delete',adminMw, routes.adminCharacterDelete);
	router.get  ('/admin/plugins/adr/monsters',         adminMw, routes.adminMonsters);
	router.post ('/admin/plugins/adr/monsters/save',    adminMw, routes.adminMonsterSave);
	router.post ('/admin/plugins/adr/monsters/delete',  adminMw, routes.adminMonsterDelete);
	router.get  ('/admin/plugins/adr/items',            adminMw, routes.adminItems);
	router.post ('/admin/plugins/adr/items/save',       adminMw, routes.adminItemSave);
	router.post ('/admin/plugins/adr/items/delete',     adminMw, routes.adminItemDelete);
	router.get  ('/admin/plugins/adr/races',            adminMw, routes.adminRaces);
	router.post ('/admin/plugins/adr/races/save',       adminMw, routes.adminRaceSave);
	router.post ('/admin/plugins/adr/races/delete',     adminMw, routes.adminRaceDelete);
	router.get  ('/admin/plugins/adr/classes',          adminMw, routes.adminClasses);
	router.post ('/admin/plugins/adr/classes/save',     adminMw, routes.adminClassSave);
	router.post ('/admin/plugins/adr/classes/delete',   adminMw, routes.adminClassDelete);
	router.get  ('/admin/plugins/adr/elements',         adminMw, routes.adminElements);
	router.post ('/admin/plugins/adr/elements/save',    adminMw, routes.adminElementSave);
	router.post ('/admin/plugins/adr/elements/delete',  adminMw, routes.adminElementDelete);
	router.get  ('/admin/plugins/adr/alignments',       adminMw, routes.adminAlignments);
	router.post ('/admin/plugins/adr/alignments/save',  adminMw, routes.adminAlignmentSave);
	router.post ('/admin/plugins/adr/alignments/delete',adminMw, routes.adminAlignmentDelete);
	router.get  ('/admin/plugins/adr/skills',           adminMw, routes.adminSkills);
	router.post ('/admin/plugins/adr/skills/save',      adminMw, routes.adminSkillSave);
	router.post ('/admin/plugins/adr/skills/delete',    adminMw, routes.adminSkillDelete);
	router.get  ('/admin/plugins/adr/stores',           adminMw, routes.adminStores);
	router.post ('/admin/plugins/adr/stores/save',      adminMw, routes.adminStoreSave);
	router.post ('/admin/plugins/adr/stores/delete',    adminMw, routes.adminStoreDelete);
	router.get  ('/admin/plugins/adr/courthouse',       adminMw, routes.adminCourthouse);
	router.post ('/admin/plugins/adr/courthouse/jail',  adminMw, routes.adminJail);
	router.post ('/admin/plugins/adr/courthouse/release',adminMw, routes.adminRelease);
	router.get  ('/admin/plugins/adr/vault',            adminMw, routes.adminVault);
	router.post ('/admin/plugins/adr/vault/stocks/save',adminMw, routes.adminStockSave);
	router.post ('/admin/plugins/adr/vault/stocks/delete',adminMw, routes.adminStockDelete);
	router.post ('/admin/plugins/adr/vault/stocks/update-prices', adminMw, routes.adminUpdatePrices);
};

function handleError(err, res, flash) {
	if (flash) {
		res.locals.adrError = err.message || 'An error occurred';
	}
	return null;
}

routes.town = async function (req, res) {
	const char  = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const count = await Character.getCount();
	res.render('adr/town', { title: 'Town', character: char, characterCount: count, activePage: 'town', uid: req.uid });
};

routes.characterCreateGet = async function (req, res) {
	const exists = await Character.exists(req.uid);
	if (exists) return res.redirect(basePath + '/adr/character');
	const [races, classes, elements, alignments] = await Promise.all([
		helpers.getAllRaces(), helpers.getAllClasses(), helpers.getAllElements(), helpers.getAllAlignments(),
	]);
	const config = await helpers.getConfig();
	res.render('adr/character-create', {
		title: 'Create Character', races, classes, elements, alignments,
		minChar: config.min_characteristic || 3, maxChar: config.max_characteristic || 20,
		uid: req.uid,
	});
};

routes.characterCreatePost = async function (req, res) {
	try {
		await Character.create(req.uid, req.body);
		res.redirect(basePath + '/adr/character');
	} catch (e) {
		const [races, classes, elements, alignments] = await Promise.all([
			helpers.getAllRaces(), helpers.getAllClasses(), helpers.getAllElements(), helpers.getAllAlignments(),
		]);
		const config = await helpers.getConfig();
		res.render('adr/character-create', {
			title: 'Create Character', races, classes, elements, alignments,
			minChar: config.min_characteristic || 3, maxChar: config.max_characteristic || 20,
			error: e.message, formData: req.body, uid: req.uid,
		});
	}
};

routes.characterView = async function (req, res) {
	const targetUid = parseInt(req.params.uid, 10);
	const char      = await Character.getByUid(targetUid);
	if (!char) return res.render('error', { status: 404, error: 'Character not found' });

	const User    = require.main.require('./src/user');
	const userData = await User.getUserFields(targetUid, ['username', 'userslug', 'picture']);
	const enriched = await Character.enrichWithLookups({ ...char });

	const equippedItems = await Inventory.getEquippedItems(targetUid);
	const isOwner  = req.uid && String(req.uid) === String(targetUid);

	res.render('adr/character', {
		title: enriched.character_name + '\'s Character Sheet',
		character: enriched,
		username: userData.username,
		userslug: userData.userslug,
		picture:  userData.picture,
		equippedItems,
		isOwner,
		uid: req.uid,
		activePage: 'character',
	});
};

routes.characterSelf = async function (req, res) {
	return routes.characterView({ ...req, params: { uid: req.uid } }, res);
};

routes.characterEditGet = async function (req, res) {
	const char = await Character.getByUid(req.uid);
	const alignments = await helpers.getAllAlignments();
	res.render('adr/character-prefs', {
		title: 'Character Preferences', character: char, alignments,
		uid: req.uid, activePage: 'prefs',
	});
};

routes.characterEditPost = async function (req, res) {
	try {
		await Character.update(req.uid, req.body);
		res.redirect(basePath + '/adr/character');
	} catch (e) {
		res.render('adr/character-prefs', { title: 'Character Preferences', error: e.message, uid: req.uid });
	}
};

routes.characterDelete = async function (req, res) {
	const config = await helpers.getConfig();
	if (!parseInt(config.allow_character_delete, 10)) return res.status(403).json({ error: 'Character deletion is disabled' });
	await Character.delete(req.uid);
	res.redirect(basePath + '/adr/character/create');
};

routes.characterList = async function (req, res) {
	const page  = parseInt(req.query.page, 10) || 1;
	const perPage = 25;
	const start = (page - 1) * perPage;
	const chars = await Character.getList(start, start + perPage - 1);
	const count = await Character.getCount();
	res.render('adr/character-list', {
		title: 'Character List', characters: chars,
		page, totalPages: Math.ceil(count / perPage),
		uid: req.uid, activePage: 'list',
	});
};

routes.battleGet = async function (req, res) {
	const char     = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const monsters = await Battle.getEligibleMonsters(req.uid);
	const active   = await Battle.getActiveBattle(req.uid);
	res.render('adr/battle', {
		title: 'Battle', character: char, monsters, activeBattle: active,
		uid: req.uid, activePage: 'battle',
	});
};

routes.battleStart = async function (req, res) {
	try {
		const battle = await Battle.startBattle(req.uid, req.body.monsterId);
		res.redirect(basePath + '/adr/battle/result/' + battle.battle_id);
	} catch (e) {
		res.redirect(basePath + '/adr/battle?error=' + encodeURIComponent(e.message));
	}
};

routes.battleAction = async function (req, res) {
	try {
		const result = await Battle.resolveBattle(req.uid, req.body.battleId, req.body.useMagic === '1');
		res.redirect(basePath + '/adr/battle/result/' + result.battleId);
	} catch (e) {
		res.redirect(basePath + '/adr/battle?error=' + encodeURIComponent(e.message));
	}
};

routes.battleFlee = async function (req, res) {
	try {
		await Battle.flee(req.uid, req.body.battleId);
		res.redirect(basePath + '/adr/battle');
	} catch (e) {
		res.redirect(basePath + '/adr/battle?error=' + encodeURIComponent(e.message));
	}
};

routes.battleResult = async function (req, res) {
	const battle  = await require.main.require('./src/database').getObject('adr:battle:' + req.params.battleId);
	if (!battle)  return res.render('error', { status: 404, error: 'Battle not found' });
	const monster = await helpers.getMonster(battle.battle_opponent_id);
	const char    = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const log     = (battle.battle_text || '').split('\n').filter(Boolean);
	const resultLabels = ['Pending', 'Victory', 'Defeat', 'Draw', 'Fled'];
	res.render('adr/battle-result', {
		title: 'Battle Result', battle, monster,
		character: char, log,
		resultLabel: resultLabels[parseInt(battle.battle_result, 10)] || '?',
		uid: req.uid, activePage: 'battle',
	});
};

routes.battleHistory = async function (req, res) {
	const page  = parseInt(req.query.page, 10) || 1;
	const start = (page - 1) * 20;
	const history = await Battle.getHistory(req.uid, start, start + 19);
	const char    = await Character.getByUid(req.uid);
	res.render('adr/battle-history', {
		title: 'Battle History', battles: history, character: char,
		page, uid: req.uid, activePage: 'battle',
	});
};

routes.battleCommunity = async function (req, res) {
	const log = await Battle.getCommunityLog(0, 49);
	res.render('adr/battle-community', {
		title: 'Community Battle Log', battles: log,
		uid: req.uid, activePage: 'battle',
	});
};

routes.pvpGet = async function (req, res) {
	const char     = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const pending  = await BattlePvp.getPendingChallenges(req.uid);
	res.render('adr/battle-pvp', {
		title: 'PvP Battles', character: char, pendingChallenges: pending,
		uid: req.uid, activePage: 'pvp',
	});
};

routes.pvpChallenge = async function (req, res) {
	try {
		await BattlePvp.challenge(req.uid, req.body.targetUid);
		res.redirect(basePath + '/adr/pvp?success=Challenge sent!');
	} catch (e) {
		res.redirect(basePath + '/adr/pvp?error=' + encodeURIComponent(e.message));
	}
};

routes.pvpAccept = async function (req, res) {
	try {
		const result = await BattlePvp.accept(req.uid, req.body.battleId);
		res.redirect(basePath + '/adr/pvp/history?success=Battle resolved!');
	} catch (e) {
		res.redirect(basePath + '/adr/pvp?error=' + encodeURIComponent(e.message));
	}
};

routes.pvpDecline = async function (req, res) {
	try {
		await BattlePvp.decline(req.uid, req.body.battleId);
		res.redirect(basePath + '/adr/pvp');
	} catch (e) {
		res.redirect(basePath + '/adr/pvp?error=' + encodeURIComponent(e.message));
	}
};

routes.pvpHistory = async function (req, res) {
	const page    = parseInt(req.query.page, 10) || 1;
	const start   = (page - 1) * 20;
	const history = await BattlePvp.getHistory(req.uid, start, start + 19);
	res.render('adr/pvp-history', { title: 'PvP History', battles: history, page, uid: req.uid, activePage: 'pvp' });
};

routes.inventoryGet = async function (req, res) {
	const char    = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const items   = await Inventory.getUserItems(req.uid);
	const warehouse = await Inventory.getWarehouseItems(req.uid);
	const weight  = await Inventory.getTotalWeight(req.uid);
	res.render('adr/inventory', {
		title: 'Inventory', character: char, items, warehouse, weight,
		uid: req.uid, activePage: 'inventory',
		error: req.query.error, success: req.query.success,
	});
};

routes.inventorySell = async function (req, res) {
	try {
		const gold = await Inventory.sellItem(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/inventory?success=Sold for ' + gold + ' gold!');
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.inventoryUse = async function (req, res) {
	try {
		const msg = await Inventory.useItem(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/inventory?success=' + encodeURIComponent(msg));
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.inventoryDrop = async function (req, res) {
	try {
		await Inventory.dropItem(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/inventory?success=Item dropped.');
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.inventoryWarehouse = async function (req, res) {
	try {
		await Inventory.moveToWarehouse(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/inventory?success=Item moved to warehouse.');
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.inventoryRetrieve = async function (req, res) {
	try {
		await Inventory.retrieveFromWarehouse(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/inventory?success=Item retrieved.');
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.inventoryGive = async function (req, res) {
	try {
		await Inventory.giveItem(req.uid, req.body.itemId, req.body.toUid);
		res.redirect(basePath + '/adr/inventory?success=Item given.');
	} catch (e) {
		res.redirect(basePath + '/adr/inventory?error=' + encodeURIComponent(e.message));
	}
};

routes.equipmentGet = async function (req, res) {
	const view = await Equipment.getEquipmentView(req.uid);
	res.render('adr/equipment', {
		title: 'Equipment', ...view,
		uid: req.uid, activePage: 'equipment',
		error: req.query.error, success: req.query.success,
	});
};

routes.equipmentEquip = async function (req, res) {
	try {
		await Equipment.equip(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/equipment?success=Item equipped!');
	} catch (e) {
		res.redirect(basePath + '/adr/equipment?error=' + encodeURIComponent(e.message));
	}
};

routes.equipmentUnequip = async function (req, res) {
	try {
		await Equipment.unequip(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/equipment?success=Item unequipped.');
	} catch (e) {
		res.redirect(basePath + '/adr/equipment?error=' + encodeURIComponent(e.message));
	}
};

routes.skillsGet = async function (req, res) {
	const char   = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const skills = await Skills.getCharacterSkills(req.uid);
	const config = await helpers.getConfig();
	res.render('adr/skills', {
		title: 'Skills', character: char, skills, config,
		uid: req.uid, activePage: 'skills',
		error: req.query.error, success: req.query.success,
	});
};

routes.skillsTrain = async function (req, res) {
	try {
		await Skills.train(req.uid, req.body.skillId);
		res.redirect(basePath + '/adr/skills?success=Skill trained!');
	} catch (e) {
		res.redirect(basePath + '/adr/skills?error=' + encodeURIComponent(e.message));
	}
};

routes.shopsGet = async function (req, res) {
	const stores = await Shops.getStores();
	const shops  = await Shops.getAllUserShops();
	res.render('adr/shops', {
		title: 'Market', stores, shops, uid: req.uid, activePage: 'shops',
	});
};

routes.storeView = async function (req, res) {
	const store = await Shops.getStore(req.params.storeId);
	if (!store) return res.render('error', { status: 404, error: 'Store not found' });
	const items = await Shops.getStoreItems(req.params.storeId);
	const char  = req.uid ? await Character.getByUid(req.uid) : null;
	res.render('adr/store-view', {
		title: store.store_name, store, items, character: char,
		uid: req.uid, activePage: 'shops',
		error: req.query.error, success: req.query.success,
	});
};

routes.storeBuy = async function (req, res) {
	try {
		await Inventory.buyFromStore(req.uid, req.body.storeId, req.body.itemId);
		res.redirect(basePath + '/adr/shops/store/' + req.body.storeId + '?success=Item purchased!');
	} catch (e) {
		res.redirect(basePath + '/adr/shops/store/' + req.body.storeId + '?error=' + encodeURIComponent(e.message));
	}
};

routes.shopView = async function (req, res) {
	const shop  = await Shops.getShop(req.params.shopId);
	if (!shop)  return res.render('error', { status: 404, error: 'Shop not found' });
	const items = await Shops.getShopItems(req.params.shopId);
	const char  = req.uid ? await Character.getByUid(req.uid) : null;
	res.render('adr/shop-view', {
		title: shop.shop_name, shop, items, character: char,
		uid: req.uid, activePage: 'shops',
		error: req.query.error, success: req.query.success,
	});
};

routes.shopBuy = async function (req, res) {
	try {
		await Shops.buyFromShop(req.uid, req.body.shopId, req.body.itemId);
		res.redirect(basePath + '/adr/shops/user/' + req.body.shopId + '?success=Item purchased!');
	} catch (e) {
		res.redirect(basePath + '/adr/shops/user/' + req.body.shopId + '?error=' + encodeURIComponent(e.message));
	}
};

routes.shopManageGet = async function (req, res) {
	const shop  = await Shops.getUserShop(req.uid);
	const char  = await Character.getByUid(req.uid);
	const items = shop ? await Shops.getShopItems(shop.shop_id) : [];
	const invItems = await Inventory.getUserItems(req.uid);
	const config = await helpers.getConfig();
	res.render('adr/shop-manage', {
		title: 'Manage Shop', shop, character: char, shopItems: items,
		inventoryItems: invItems, shopCost: config.new_shop_price,
		uid: req.uid, activePage: 'shops',
		error: req.query.error, success: req.query.success,
	});
};

routes.shopCreate = async function (req, res) {
	try {
		await Shops.createShop(req.uid, req.body);
		res.redirect(basePath + '/adr/shops/manage?success=Shop created!');
	} catch (e) {
		res.redirect(basePath + '/adr/shops/manage?error=' + encodeURIComponent(e.message));
	}
};

routes.shopUpdate = async function (req, res) {
	try {
		await Shops.updateShop(req.uid, req.body);
		res.redirect(basePath + '/adr/shops/manage?success=Shop updated!');
	} catch (e) {
		res.redirect(basePath + '/adr/shops/manage?error=' + encodeURIComponent(e.message));
	}
};

routes.shopAddItem = async function (req, res) {
	try {
		const result = await Shops.addItemToShop(req.uid, req.body.itemId, req.body.price);
		res.redirect(basePath + '/adr/shops/manage?success=Item listed! Tax paid: ' + result.taxCost);
	} catch (e) {
		res.redirect(basePath + '/adr/shops/manage?error=' + encodeURIComponent(e.message));
	}
};

routes.shopRemoveItem = async function (req, res) {
	try {
		await Shops.removeItemFromShop(req.uid, req.body.itemId);
		res.redirect(basePath + '/adr/shops/manage?success=Item removed from shop.');
	} catch (e) {
		res.redirect(basePath + '/adr/shops/manage?error=' + encodeURIComponent(e.message));
	}
};

routes.templeGet = async function (req, res) {
	const char = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const healCost = await Temple.getHealCost(req.uid);
	const resurrCost = await Temple.getResurrectCost();
	res.render('adr/temple', {
		title: 'Temple', character: char, healCost, resurrCost,
		uid: req.uid, activePage: 'temple',
		error: req.query.error, success: req.query.success,
	});
};

routes.templeHeal = async function (req, res) {
	try {
		const result = await Temple.heal(req.uid);
		res.redirect(basePath + '/adr/temple?success=Healed for ' + result.cost + ' gold!');
	} catch (e) {
		res.redirect(basePath + '/adr/temple?error=' + encodeURIComponent(e.message));
	}
};

routes.templeResurrect = async function (req, res) {
	try {
		const result = await Temple.resurrect(req.uid);
		res.redirect(basePath + '/adr/temple?success=Resurrected for ' + result.cost + ' gold!');
	} catch (e) {
		res.redirect(basePath + '/adr/temple?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultGet = async function (req, res) {
	await Vault.accrueInterest(req.uid);
	const char    = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const account = await Vault.getAccount(req.uid);
	const stocks  = await Vault.getAllStocks();
	const holdings = await Vault.getUserStockHoldings(req.uid);
	const config  = await helpers.getConfig();
	res.render('adr/vault', {
		title: 'Vault', character: char, account, stocks, holdings,
		config, uid: req.uid, activePage: 'vault',
		error: req.query.error, success: req.query.success,
	});
};

routes.vaultDeposit = async function (req, res) {
	try {
		await Vault.deposit(req.uid, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Deposited successfully.');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultWithdraw = async function (req, res) {
	try {
		await Vault.withdraw(req.uid, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Withdrawn successfully.');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultLoan = async function (req, res) {
	try {
		await Vault.takeLoan(req.uid, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Loan granted!');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultRepay = async function (req, res) {
	try {
		await Vault.repayLoan(req.uid, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Loan repaid!');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultStockBuy = async function (req, res) {
	try {
		await Vault.buyStock(req.uid, req.body.stockId, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Shares purchased!');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.vaultStockSell = async function (req, res) {
	try {
		await Vault.sellStock(req.uid, req.body.stockId, req.body.amount);
		res.redirect(basePath + '/adr/vault?success=Shares sold!');
	} catch (e) {
		res.redirect(basePath + '/adr/vault?error=' + encodeURIComponent(e.message));
	}
};

routes.cellGet = async function (req, res) {
	const jailRecord = await Cell.getJailRecord(req.uid);
	const char       = await Character.enrichWithLookups(await Character.getByUid(req.uid));
	const config     = await helpers.getConfig();
	res.render('adr/cell', {
		title: 'Prison Cell', character: char, jailRecord, config,
		uid: req.uid, activePage: 'cell',
		error: req.query.error, success: req.query.success,
	});
};

routes.cellBuyFreedom = async function (req, res) {
	try {
		const cost = await Cell.buyFreedom(req.uid);
		res.redirect(basePath + '/adr/town?success=Freedom purchased for ' + cost + ' gold!');
	} catch (e) {
		res.redirect(basePath + '/adr/cell?error=' + encodeURIComponent(e.message));
	}
};

routes.courthouseGet = async function (req, res) {
	const cases  = await Courthouse.getCases();
	const char   = await Character.getByUid(req.uid);
	const config = await helpers.getConfig();
	for (const c of cases) {
		c.hasVoted = await Courthouse.hasVoted(req.uid, c.uid);
	}
	res.render('adr/courthouse', {
		title: 'Courthouse', cases, character: char, config,
		uid: req.uid, activePage: 'courthouse',
		error: req.query.error, success: req.query.success,
	});
};

routes.courthouseVote = async function (req, res) {
	try {
		await Courthouse.submitVote(req.uid, req.body.jailedUid, req.body.decision);
		res.redirect(basePath + '/adr/courthouse?success=Vote submitted!');
	} catch (e) {
		res.redirect(basePath + '/adr/courthouse?error=' + encodeURIComponent(e.message));
	}
};

routes.forgeGet = async function (req, res) {
	const view   = await Forge.getForgeView(req.uid);
	res.render('adr/forge', {
		title: 'Forge', ...view,
		uid: req.uid, activePage: 'forge',
		error: req.query.error, success: req.query.success,
	});
};

routes.forgeWeapon = async function (req, res) {
	try {
		const result = await Forge.forgeWeapon(req.uid, req.body.mat1Id, req.body.mat2Id);
		res.redirect(basePath + '/adr/forge?success=' + encodeURIComponent(result.message));
	} catch (e) {
		res.redirect(basePath + '/adr/forge?error=' + encodeURIComponent(e.message));
	}
};

routes.forgeMine = async function (req, res) {
	try {
		const result = await require('./skills').mine(req.uid);
		res.redirect(basePath + '/adr/forge?success=' + encodeURIComponent(result.message));
	} catch (e) {
		res.redirect(basePath + '/adr/forge?error=' + encodeURIComponent(e.message));
	}
};

routes.forgeEnchant = async function (req, res) {
	try {
		const result = await require('./skills').enchant(req.uid, req.body.weaponId);
		res.redirect(basePath + '/adr/forge?success=' + encodeURIComponent(result.message));
	} catch (e) {
		res.redirect(basePath + '/adr/forge?error=' + encodeURIComponent(e.message));
	}
};

routes.faqGet = function (req, res) {
	res.render('adr/faq', { title: 'ADR FAQ', uid: req.uid, activePage: 'faq' });
};

routes.copyrightGet = function (req, res) {
	res.render('adr/copyright', { title: 'Copyright & Credits', uid: req.uid, activePage: 'copyright' });
};

routes.adminIndex = async function (req, res) {
	const charCount = await Character.getCount();
	const config    = await helpers.getConfig();
	res.render('admin/plugins/adr/index', { title: 'ADR Admin', charCount, config });
};

routes.adminSettingsGet = async function (req, res) {
	const settings = await Admin.getSettings();
	res.render('admin/plugins/adr/settings', { title: 'ADR Settings', settings });
};

routes.adminSettingsSave = async function (req, res) {
	try {
		await Admin.saveSettings(req.body);
		res.redirect('/admin/plugins/adr/settings?success=Settings saved!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/settings?error=' + encodeURIComponent(e.message));
	}
};

routes.adminCharacters = async function (req, res) {
	const page  = parseInt(req.query.page, 10) || 1;
	const start = (page - 1) * 25;
	const chars = await Admin.listCharacters(start, start + 24);
	const races = await helpers.getAllRaces();
	const classes = await helpers.getAllClasses();
	const count = await Character.getCount();
	res.render('admin/plugins/adr/characters', {
		title: 'ADR Characters', characters: chars, races, classes,
		page, totalPages: Math.ceil(count / 25),
		error: req.query.error, success: req.query.success,
	});
};

routes.adminCharacterEdit = async function (req, res) {
	try {
		await Admin.editCharacter(req.body.uid, req.body);
		res.redirect('/admin/plugins/adr/characters?success=Character saved!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/characters?error=' + encodeURIComponent(e.message));
	}
};

routes.adminCharacterDelete = async function (req, res) {
	try {
		await Admin.deleteCharacter(req.body.uid);
		res.redirect('/admin/plugins/adr/characters?success=Character deleted!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/characters?error=' + encodeURIComponent(e.message));
	}
};

routes.adminMonsters = async function (req, res) {
	const monsters = await Admin.listMonsters();
	const elements = await helpers.getAllElements();
	res.render('admin/plugins/adr/monsters', {
		title: 'ADR Monsters', monsters, elements,
		error: req.query.error, success: req.query.success,
	});
};

routes.adminMonsterSave = async function (req, res) {
	try {
		await Admin.saveMonster(req.body);
		res.redirect('/admin/plugins/adr/monsters?success=Monster saved!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/monsters?error=' + encodeURIComponent(e.message));
	}
};

routes.adminMonsterDelete = async function (req, res) {
	try {
		await Admin.deleteMonster(req.body.monsterId);
		res.redirect('/admin/plugins/adr/monsters?success=Monster deleted!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/monsters?error=' + encodeURIComponent(e.message));
	}
};

routes.adminItems = async function (req, res) {
	const page  = parseInt(req.query.page, 10) || 1;
	const start = (page - 1) * 50;
	const items = await Admin.listItems(start, start + 49);
	const stores = await Admin.listStores();
	const elements = await helpers.getAllElements();
	const races = await helpers.getAllRaces();
	const classes = await helpers.getAllClasses();
	const aligns = await helpers.getAllAlignments();
	const count = await require.main.require('./src/database').sortedSetCard('adr:items');
	res.render('admin/plugins/adr/items', {
		title: 'ADR Items', items, stores, elements, races, classes, alignments: aligns,
		page, totalPages: Math.ceil(count / 50),
		error: req.query.error, success: req.query.success,
	});
};

routes.adminItemSave = async function (req, res) {
	try {
		await Admin.saveItem(req.body);
		res.redirect('/admin/plugins/adr/items?success=Item saved!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/items?error=' + encodeURIComponent(e.message));
	}
};

routes.adminItemDelete = async function (req, res) {
	try {
		await Admin.deleteItem(req.body.itemId);
		res.redirect('/admin/plugins/adr/items?success=Item deleted!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/items?error=' + encodeURIComponent(e.message));
	}
};

routes.adminRaces = async function (req, res) {
	const races = await Admin.listRaces();
	res.render('admin/plugins/adr/races', {
		title: 'ADR Races', races, error: req.query.error, success: req.query.success,
	});
};
routes.adminRaceSave = async function (req, res) {
	try { await Admin.saveRace(req.body); res.redirect('/admin/plugins/adr/races?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/races?error=' + encodeURIComponent(e.message)); }
};
routes.adminRaceDelete = async function (req, res) {
	try { await Admin.deleteRace(req.body.raceId); res.redirect('/admin/plugins/adr/races?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/races?error=' + encodeURIComponent(e.message)); }
};

routes.adminClasses = async function (req, res) {
	const classes = await Admin.listClasses();
	res.render('admin/plugins/adr/classes', {
		title: 'ADR Classes', classes, error: req.query.error, success: req.query.success,
	});
};
routes.adminClassSave = async function (req, res) {
	try { await Admin.saveClass(req.body); res.redirect('/admin/plugins/adr/classes?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/classes?error=' + encodeURIComponent(e.message)); }
};
routes.adminClassDelete = async function (req, res) {
	try { await Admin.deleteClass(req.body.classId); res.redirect('/admin/plugins/adr/classes?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/classes?error=' + encodeURIComponent(e.message)); }
};

routes.adminElements = async function (req, res) {
	const elements = await Admin.listElements();
	res.render('admin/plugins/adr/elements', {
		title: 'ADR Elements', elements, error: req.query.error, success: req.query.success,
	});
};
routes.adminElementSave = async function (req, res) {
	try { await Admin.saveElement(req.body); res.redirect('/admin/plugins/adr/elements?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/elements?error=' + encodeURIComponent(e.message)); }
};
routes.adminElementDelete = async function (req, res) {
	try { await Admin.deleteElement(req.body.elementId); res.redirect('/admin/plugins/adr/elements?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/elements?error=' + encodeURIComponent(e.message)); }
};

routes.adminAlignments = async function (req, res) {
	const alignments = await Admin.listAlignments();
	res.render('admin/plugins/adr/alignments', {
		title: 'ADR Alignments', alignments, error: req.query.error, success: req.query.success,
	});
};
routes.adminAlignmentSave = async function (req, res) {
	try { await Admin.saveAlignment(req.body); res.redirect('/admin/plugins/adr/alignments?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/alignments?error=' + encodeURIComponent(e.message)); }
};
routes.adminAlignmentDelete = async function (req, res) {
	try { await Admin.deleteAlignment(req.body.alignmentId); res.redirect('/admin/plugins/adr/alignments?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/alignments?error=' + encodeURIComponent(e.message)); }
};

routes.adminSkills = async function (req, res) {
	const skills = await Admin.listSkills();
	res.render('admin/plugins/adr/skills', {
		title: 'ADR Skills', skills, error: req.query.error, success: req.query.success,
	});
};
routes.adminSkillSave = async function (req, res) {
	try { await Admin.saveSkill(req.body); res.redirect('/admin/plugins/adr/skills?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/skills?error=' + encodeURIComponent(e.message)); }
};
routes.adminSkillDelete = async function (req, res) {
	try { await Admin.deleteSkill(req.body.skillId); res.redirect('/admin/plugins/adr/skills?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/skills?error=' + encodeURIComponent(e.message)); }
};

routes.adminStores = async function (req, res) {
	const stores = await Admin.listStores();
	res.render('admin/plugins/adr/stores', {
		title: 'ADR Stores', stores, error: req.query.error, success: req.query.success,
	});
};
routes.adminStoreSave = async function (req, res) {
	try { await Admin.saveStore(req.body); res.redirect('/admin/plugins/adr/stores?success=Saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/stores?error=' + encodeURIComponent(e.message)); }
};
routes.adminStoreDelete = async function (req, res) {
	try { await Admin.deleteStore(req.body.storeId); res.redirect('/admin/plugins/adr/stores?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/stores?error=' + encodeURIComponent(e.message)); }
};

routes.adminCourthouse = async function (req, res) {
	const cases  = await Courthouse.getCases();
	const User   = require.main.require('./src/user');
	res.render('admin/plugins/adr/courthouse', {
		title: 'ADR Courthouse', cases,
		error: req.query.error, success: req.query.success,
	});
};
routes.adminJail = async function (req, res) {
	try {
		await Admin.jailUser(req.body.targetUid, req.body.sentence, req.body.caution, req.uid);
		res.redirect('/admin/plugins/adr/courthouse?success=User jailed!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/courthouse?error=' + encodeURIComponent(e.message));
	}
};
routes.adminRelease = async function (req, res) {
	try {
		await Admin.releaseUser(req.body.targetUid);
		res.redirect('/admin/plugins/adr/courthouse?success=User released!');
	} catch (e) {
		res.redirect('/admin/plugins/adr/courthouse?error=' + encodeURIComponent(e.message));
	}
};

routes.adminVault = async function (req, res) {
	const stocks = await Admin.listStocks();
	res.render('admin/plugins/adr/vault', {
		title: 'ADR Vault / Stocks', stocks,
		error: req.query.error, success: req.query.success,
	});
};
routes.adminStockSave = async function (req, res) {
	try { await Admin.saveStock(req.body); res.redirect('/admin/plugins/adr/vault?success=Stock saved!'); }
	catch (e) { res.redirect('/admin/plugins/adr/vault?error=' + encodeURIComponent(e.message)); }
};
routes.adminStockDelete = async function (req, res) {
	try { await Admin.deleteStock(req.body.stockId); res.redirect('/admin/plugins/adr/vault?success=Deleted!'); }
	catch (e) { res.redirect('/admin/plugins/adr/vault?error=' + encodeURIComponent(e.message)); }
};
routes.adminUpdatePrices = async function (req, res) {
	try { await Admin.updateStockPrices(); res.redirect('/admin/plugins/adr/vault?success=Prices updated!'); }
	catch (e) { res.redirect('/admin/plugins/adr/vault?error=' + encodeURIComponent(e.message)); }
};
