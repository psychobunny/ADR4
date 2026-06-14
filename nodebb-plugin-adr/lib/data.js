'use strict';

const db = require.main.require('./src/database');

const Data = module.exports = {};

Data.seedAll = async function () {
	await Promise.all([
		Data.seedRaces(),
		Data.seedClasses(),
		Data.seedElements(),
		Data.seedAlignments(),
		Data.seedSkills(),
		Data.seedMonsters(),
		Data.seedStores(),
		Data.seedStocks(),
	]);
};

Data.seedRaces = async function () {
	const races = [
		{ race_id: 1, race_name: 'Human',    race_desc: 'A balanced and adaptable race.',         race_level: 0, race_might_bonus: 0,  race_dexterity_bonus: 0, race_constitution_bonus: 0, race_intelligence_bonus: 0, race_wisdom_bonus: 0,  race_charisma_bonus: 0,  race_skill_mining_bonus: 0, race_skill_stone_bonus: 0, race_skill_forge_bonus: 0, race_skill_enchantment_bonus: 0, race_skill_trading_bonus: 0, race_skill_thief_bonus: 0, race_might_penalty: 0, race_dexterity_penalty: 0, race_constitution_penalty: 0, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 0, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 2, race_name: 'Half-Elf', race_desc: 'Graceful and charming, with elven blood.', race_level: 0, race_might_bonus: 0, race_dexterity_bonus: 1, race_constitution_bonus: 0, race_intelligence_bonus: 0, race_wisdom_bonus: 0,  race_charisma_bonus: 1,  race_skill_mining_bonus: 0, race_skill_stone_bonus: 0, race_skill_forge_bonus: 0, race_skill_enchantment_bonus: 1, race_skill_trading_bonus: 0, race_skill_thief_bonus: 0, race_might_penalty: 0, race_dexterity_penalty: 0, race_constitution_penalty: 1, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 0, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 3, race_name: 'Half-Orc', race_desc: 'Powerful and tough but lacking in charm.', race_level: 0, race_might_bonus: 2, race_dexterity_bonus: 0, race_constitution_bonus: 1, race_intelligence_bonus: 0, race_wisdom_bonus: 0,  race_charisma_bonus: 0,  race_skill_mining_bonus: 1, race_skill_stone_bonus: 0, race_skill_forge_bonus: 1, race_skill_enchantment_bonus: 0, race_skill_trading_bonus: 0, race_skill_thief_bonus: 0, race_might_penalty: 0, race_dexterity_penalty: 1, race_constitution_penalty: 0, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 3, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 4, race_name: 'Elf',      race_desc: 'Elegant and perceptive, masters of enchantment.', race_level: 0, race_might_bonus: 0, race_dexterity_bonus: 2, race_constitution_bonus: 0, race_intelligence_bonus: 0, race_wisdom_bonus: 0, race_charisma_bonus: 2, race_skill_mining_bonus: 0, race_skill_stone_bonus: 0, race_skill_forge_bonus: 0, race_skill_enchantment_bonus: 1, race_skill_trading_bonus: 1, race_skill_thief_bonus: 0, race_might_penalty: 1, race_dexterity_penalty: 0, race_constitution_penalty: 2, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 0, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 5, race_name: 'Gnome',    race_desc: 'Small but clever traders.',              race_level: 0, race_might_bonus: 0,  race_dexterity_bonus: 1, race_constitution_bonus: 0, race_intelligence_bonus: 0, race_wisdom_bonus: 1,  race_charisma_bonus: 0,  race_skill_mining_bonus: 0, race_skill_stone_bonus: 0, race_skill_forge_bonus: 0, race_skill_enchantment_bonus: 0, race_skill_trading_bonus: 2, race_skill_thief_bonus: 0, race_might_penalty: 0, race_dexterity_penalty: 0, race_constitution_penalty: 2, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 0, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 6, race_name: 'Halfling', race_desc: 'Nimble thieves with surprising wisdom.', race_level: 2, race_might_bonus: 0,  race_dexterity_bonus: 2, race_constitution_bonus: 0, race_intelligence_bonus: 0, race_wisdom_bonus: 2,  race_charisma_bonus: 0,  race_skill_mining_bonus: 0, race_skill_stone_bonus: 0, race_skill_forge_bonus: 0, race_skill_enchantment_bonus: 0, race_skill_trading_bonus: 0, race_skill_thief_bonus: 3, race_might_penalty: 0, race_dexterity_penalty: 0, race_constitution_penalty: 2, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 0, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
		{ race_id: 7, race_name: 'Dwarf',    race_desc: 'Sturdy miners and master smiths.',      race_level: 0, race_might_bonus: 1,  race_dexterity_bonus: 0, race_constitution_bonus: 2, race_intelligence_bonus: 0, race_wisdom_bonus: 1,  race_charisma_bonus: 0,  race_skill_mining_bonus: 2, race_skill_stone_bonus: 2, race_skill_forge_bonus: 1, race_skill_enchantment_bonus: 0, race_skill_trading_bonus: 0, race_skill_thief_bonus: 0, race_might_penalty: 0, race_dexterity_penalty: 2, race_constitution_penalty: 0, race_intelligence_penalty: 0, race_wisdom_penalty: 0, race_charisma_penalty: 3, race_weight: 1000, race_weight_per_level: 5, race_magic_attack_bonus: 0, race_magic_resistance_bonus: 0, race_magic_attack_penalty: 0, race_magic_resistance_penalty: 0 },
	];
	for (const r of races) {
		await db.setObject('adr:race:' + r.race_id, r);
		await db.sortedSetAdd('adr:races', r.race_id, r.race_id);
	}
};

Data.seedClasses = async function () {
	const classes = [
		{ class_id: 1,  class_name: 'Fighter',   class_desc: 'A stalwart warrior trained in all weapons and armour.',  class_level: 0, class_might_req: 0,  class_dexterity_req: 0,  class_constitution_req: 0,  class_intelligence_req: 0,  class_wisdom_req: 0,  class_charisma_req: 0,  class_base_hp: 30, class_base_mp: 2,  class_base_ac: 15, class_update_hp: 3, class_update_mp: 0, class_update_ac: 1, class_update_xp_req: 1500, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 2,  class_name: 'Barbarian', class_desc: 'A ferocious warrior who channels rage into power.',     class_level: 0, class_might_req: 12, class_dexterity_req: 0,  class_constitution_req: 10, class_intelligence_req: 0,  class_wisdom_req: 0,  class_charisma_req: 0,  class_base_hp: 40, class_base_mp: 1,  class_base_ac: 10, class_update_hp: 4, class_update_mp: 0, class_update_ac: 0, class_update_xp_req: 2000, class_update_of: 1, class_update_of_req: 5,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 3,  class_name: 'Druid',     class_desc: 'A nature mystic who channels elemental forces.',         class_level: 0, class_might_req: 0,  class_dexterity_req: 0,  class_constitution_req: 0,  class_intelligence_req: 0,  class_wisdom_req: 10, class_charisma_req: 0,  class_base_hp: 20, class_base_mp: 20, class_base_ac: 10, class_update_hp: 1, class_update_mp: 2, class_update_ac: 2, class_update_xp_req: 1800, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 4,  class_name: 'Bard',      class_desc: 'A versatile performer who excels at everything.',        class_level: 0, class_might_req: 3,  class_dexterity_req: 3,  class_constitution_req: 3,  class_intelligence_req: 3,  class_wisdom_req: 3,  class_charisma_req: 10, class_base_hp: 15, class_base_mp: 15, class_base_ac: 15, class_update_hp: 2, class_update_mp: 2, class_update_ac: 2, class_update_xp_req: 1200, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 5,  class_name: 'Magician',  class_desc: 'A studious arcane caster of tremendous power.',          class_level: 0, class_might_req: 0,  class_dexterity_req: 0,  class_constitution_req: 0,  class_intelligence_req: 14, class_wisdom_req: 14, class_charisma_req: 0, class_base_hp: 8,  class_base_mp: 30, class_base_ac: 5,  class_update_hp: 0, class_update_mp: 1, class_update_ac: 3, class_update_xp_req: 2500, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 6,  class_name: 'Monk',      class_desc: 'A disciplined martial artist who seeks balance.',        class_level: 0, class_might_req: 5,  class_dexterity_req: 5,  class_constitution_req: 5,  class_intelligence_req: 5,  class_wisdom_req: 5,  class_charisma_req: 5,  class_base_hp: 25, class_base_mp: 10, class_base_ac: 20, class_update_hp: 2, class_update_mp: 2, class_update_ac: 1, class_update_xp_req: 2400, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 7,  class_name: 'Paladin',   class_desc: 'A holy warrior devoted to righteousness.',              class_level: 0, class_might_req: 10, class_dexterity_req: 8,  class_constitution_req: 10, class_intelligence_req: 10, class_wisdom_req: 8,  class_charisma_req: 15, class_base_hp: 40, class_base_mp: 15, class_base_ac: 20, class_update_hp: 2, class_update_mp: 4, class_update_ac: 1, class_update_xp_req: 3000, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 8,  class_name: 'Priest',    class_desc: 'A devoted cleric blessed with healing powers.',         class_level: 0, class_might_req: 0,  class_dexterity_req: 0,  class_constitution_req: 0,  class_intelligence_req: 10, class_wisdom_req: 12, class_charisma_req: 0,  class_base_hp: 20, class_base_mp: 20, class_base_ac: 15, class_update_hp: 1, class_update_mp: 2, class_update_ac: 2, class_update_xp_req: 2000, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 9,  class_name: 'Sorcerer',  class_desc: 'A born wielder of innate arcane might.',                class_level: 0, class_might_req: 0,  class_dexterity_req: 0,  class_constitution_req: 0,  class_intelligence_req: 16, class_wisdom_req: 0,  class_charisma_req: 0,  class_base_hp: 30, class_base_mp: 100,class_base_ac: 10, class_update_hp: 0, class_update_mp: 1, class_update_ac: 10,class_update_xp_req: 4500, class_update_of: 5, class_update_of_req: 10, class_selectable: 0, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
		{ class_id: 10, class_name: 'Thief',     class_desc: 'A cunning rogue who excels at stealth and theft.',      class_level: 0, class_might_req: 0,  class_dexterity_req: 12, class_constitution_req: 0,  class_intelligence_req: 0,  class_wisdom_req: 0,  class_charisma_req: 0,  class_base_hp: 20, class_base_mp: 10, class_base_ac: 10, class_update_hp: 1, class_update_mp: 2, class_update_ac: 1, class_update_xp_req: 1500, class_update_of: 0, class_update_of_req: 0,  class_selectable: 1, class_magic_attack_req: 0, class_magic_resistance_req: 0 },
	];
	for (const c of classes) {
		await db.setObject('adr:class:' + c.class_id, c);
		await db.sortedSetAdd('adr:classes', c.class_id, c.class_id);
	}
};

Data.seedElements = async function () {
	const elements = [
		{ element_id: 1, element_name: 'Water', element_desc: 'The flowing force of water.',  element_level: 0, element_skill_mining_bonus: 0, element_skill_stone_bonus: 0, element_skill_forge_bonus: 0, element_skill_enchantment_bonus: 1, element_skill_trading_bonus: 0, element_skill_thief_bonus: 0, element_oppose_strong: 4, element_oppose_strong_dmg: 130, element_oppose_same_dmg: 75, element_oppose_weak: 2, element_oppose_weak_dmg: 75, element_colour: '#3399ff' },
		{ element_id: 2, element_name: 'Earth', element_desc: 'The solid power of earth.',    element_level: 0, element_skill_mining_bonus: 1, element_skill_stone_bonus: 1, element_skill_forge_bonus: 0, element_skill_enchantment_bonus: 0, element_skill_trading_bonus: 0, element_skill_thief_bonus: 0, element_oppose_strong: 1, element_oppose_strong_dmg: 130, element_oppose_same_dmg: 75, element_oppose_weak: 4, element_oppose_weak_dmg: 75, element_colour: '#996633' },
		{ element_id: 3, element_name: 'Holy',  element_desc: 'The radiant power of light.', element_level: 2, element_skill_mining_bonus: 1, element_skill_stone_bonus: 1, element_skill_forge_bonus: 1, element_skill_enchantment_bonus: 1, element_skill_trading_bonus: 1, element_skill_thief_bonus: 1, element_oppose_strong: 0, element_oppose_strong_dmg: 100, element_oppose_same_dmg: 75, element_oppose_weak: 0, element_oppose_weak_dmg: 100, element_colour: '#ffcc00' },
		{ element_id: 4, element_name: 'Fire',  element_desc: 'The blazing force of flame.',  element_level: 0, element_skill_mining_bonus: 0, element_skill_stone_bonus: 0, element_skill_forge_bonus: 1, element_skill_enchantment_bonus: 0, element_skill_trading_bonus: 0, element_skill_thief_bonus: 0, element_oppose_strong: 2, element_oppose_strong_dmg: 130, element_oppose_same_dmg: 75, element_oppose_weak: 1, element_oppose_weak_dmg: 75, element_colour: '#ff4400' },
	];
	for (const e of elements) {
		await db.setObject('adr:element:' + e.element_id, e);
		await db.sortedSetAdd('adr:elements', e.element_id, e.element_id);
	}
};

Data.seedAlignments = async function () {
	const alignments = [
		{ alignment_id: 1, alignment_name: 'Neutral', alignment_desc: 'Neither good nor evil, walking the middle path.', alignment_level: 0 },
		{ alignment_id: 2, alignment_name: 'Evil',    alignment_desc: 'Pursues self-interest above all else.',           alignment_level: 0 },
		{ alignment_id: 3, alignment_name: 'Good',    alignment_desc: 'Dedicated to justice and the protection of others.', alignment_level: 0 },
	];
	for (const a of alignments) {
		await db.setObject('adr:alignment:' + a.alignment_id, a);
		await db.sortedSetAdd('adr:alignments', a.alignment_id, a.alignment_id);
	}
};

Data.seedSkills = async function () {
	const skills = [
		{ skill_id: 1, skill_name: 'Mining',      skill_desc: 'Use a pickaxe to mine raw materials from the earth.',          skill_req: 100, skill_chance: 5 },
		{ skill_id: 2, skill_name: 'Stonecraft',   skill_desc: 'Shape and refine stones into useful components.',              skill_req: 200, skill_chance: 5 },
		{ skill_id: 3, skill_name: 'Forge',        skill_desc: 'Craft weapons and armour from raw materials.',                 skill_req: 50,  skill_chance: 5 },
		{ skill_id: 4, skill_name: 'Enchantment',  skill_desc: 'Imbue items with magical properties using a magic tome.',     skill_req: 300, skill_chance: 5 },
		{ skill_id: 5, skill_name: 'Trading',      skill_desc: 'Haggle and trade to earn better prices.',                     skill_req: 80,  skill_chance: 5 },
		{ skill_id: 6, skill_name: 'Thievery',     skill_desc: 'Steal items from shops or other characters.',                 skill_req: 70,  skill_chance: 5 },
	];
	for (const s of skills) {
		await db.setObject('adr:skill:' + s.skill_id, s);
		await db.sortedSetAdd('adr:skills', s.skill_id, s.skill_id);
	}
};

Data.seedMonsters = async function () {
	const monsters = [
		{ monster_id: 1, monster_name: 'Globuz',   monster_level: 1, monster_base_hp: 15,  monster_base_att: 30,  monster_base_def: 30,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 1 },
		{ monster_id: 2, monster_name: 'Kargh',    monster_level: 2, monster_base_hp: 20,  monster_base_att: 40,  monster_base_def: 60,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 2 },
		{ monster_id: 3, monster_name: 'Bouglou',  monster_level: 1, monster_base_hp: 14,  monster_base_att: 40,  monster_base_def: 70,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 4 },
		{ monster_id: 4, monster_name: 'Dretg',    monster_level: 1, monster_base_hp: 25,  monster_base_att: 30,  monster_base_def: 30,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 1 },
		{ monster_id: 5, monster_name: 'Greyiok',  monster_level: 1, monster_base_hp: 10,  monster_base_att: 70,  monster_base_def: 70,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 2 },
		{ monster_id: 6, monster_name: 'Itchy',    monster_level: 2, monster_base_hp: 25,  monster_base_att: 90,  monster_base_def: 80,  monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a magical bolt', monster_base_magic_attack: 10, monster_base_magic_resistance: 10, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 4 },
		{ monster_id: 7, monster_name: 'Globber',  monster_level: 3, monster_base_hp: 45,  monster_base_att: 250, monster_base_def: 200, monster_base_mp: 10, monster_base_mp_power: 1,  monster_base_custom_spell: 'a powerful curse', monster_base_magic_attack: 20, monster_base_magic_resistance: 20, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 3 },
		{ monster_id: 8, monster_name: 'Scratchy', monster_level: 4, monster_base_hp: 80,  monster_base_att: 350, monster_base_def: 300, monster_base_mp: 20, monster_base_mp_power: 2,  monster_base_custom_spell: 'a mighty spell', monster_base_magic_attack: 30, monster_base_magic_resistance: 30, monster_base_sp: 0, monster_thief_skill: 0, monster_base_element: 2 },
	];
	for (const m of monsters) {
		await db.setObject('adr:monster:' + m.monster_id, m);
		await db.sortedSetAdd('adr:monsters', m.monster_level, m.monster_id);
	}
	await db.setObjectField('global', 'nextAdrMonsterId', monsters.length);
};

Data.seedStores = async function () {
	const stores = [
		{ store_id: 1, store_name: 'Forum Store',      store_desc: 'The general forum store with items for all adventurers.', store_status: 1, store_sales_status: 0, store_admin: 0, store_owner_id: 1 },
		{ store_id: 2, store_name: 'Admin Only Store', store_desc: 'Exclusive items available only to administrators.',       store_status: 1, store_sales_status: 0, store_admin: 1, store_owner_id: 1 },
	];
	for (const s of stores) {
		await db.setObject('adr:store:' + s.store_id, s);
		await db.sortedSetAdd('adr:stores', s.store_id, s.store_id);
	}
	await db.setObjectField('global', 'nextAdrStoreId', stores.length);

	const defaultItems = [
		{ item_id: 1,  item_name: 'Iron Ore',         item_desc: 'A chunk of raw iron ore.',                 item_type_use: 1,  item_quality: 3, item_power: 1,  item_duration: 1,   item_duration_max: 1,   item_price: 56,    item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 2,  item_name: 'Sapphire',          item_desc: 'A shimmering blue gemstone.',              item_type_use: 2,  item_quality: 3, item_power: 4,  item_duration: 1,   item_duration_max: 1,   item_price: 352,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 3,  item_name: 'Diamond',           item_desc: 'A brilliant cut diamond.',                item_type_use: 2,  item_quality: 4, item_power: 5,  item_duration: 1,   item_duration_max: 1,   item_price: 555,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 4,  item_name: 'Magic Tome',        item_desc: 'A tome of arcane knowledge for enchanting.', item_type_use: 4, item_quality: 3, item_power: 1,  item_duration: 100, item_duration_max: 100, item_price: 111,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 5,  item_name: 'Pickaxe',           item_desc: 'A sturdy pickaxe for mining ore.',         item_type_use: 3,  item_quality: 3, item_power: 3,  item_duration: 200, item_duration_max: 200, item_price: 154,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 6,  item_name: 'Minor Defence Scroll', item_desc: 'A scroll that wards off magical attacks.', item_type_use: 12, item_quality: 3, item_power: 1, item_duration: 1,  item_duration_max: 1,   item_price: 550,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 7,  item_name: 'Scroll of Fury',    item_desc: 'Increases magical attack power.',          item_type_use: 11, item_quality: 3, item_power: 10, item_duration: 10,  item_duration_max: 10,  item_price: 100,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_restrict_class_enable: 1, item_restrict_class: '3,5,8,9,', item_restrict_level: 5, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 50 },
		{ item_id: 8,  item_name: 'Protection Scroll', item_desc: 'A scroll of strong magical protection.',   item_type_use: 12, item_quality: 3, item_power: 1,  item_duration: 1,   item_duration_max: 1,   item_price: 550,   item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 9,  item_name: 'Grand Attack Scroll', item_desc: 'A powerful magic attack scroll.',       item_type_use: 11, item_quality: 4, item_power: 3,  item_duration: 1,   item_duration_max: 1,   item_price: 1078,  item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 10, item_name: 'Silver Ring',       item_desc: 'A ring that enhances magical abilities.', item_type_use: 14, item_quality: 3, item_power: 1,  item_duration: 150, item_duration_max: 150, item_price: 11000, item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 11, item_name: 'Gold Ring',         item_desc: 'A finely crafted ring of pure gold.',    item_type_use: 14, item_quality: 4, item_power: 5,  item_duration: 600, item_duration_max: 600, item_price: 27721, item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 12, item_name: 'Iron Amulet',       item_desc: 'An amulet that grants magical resistance.', item_type_use: 13, item_quality: 4, item_power: 5, item_duration: 650, item_duration_max: 650, item_price: 13861, item_weight: 25, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 25, item_add_power: 10, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 13, item_name: 'Leather Armour',    item_desc: 'Basic protection for beginner adventurers.', item_type_use: 7, item_quality: 5, item_power: 1, item_duration: 100, item_duration_max: 100, item_price: 35,    item_weight: 10, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 15, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 14, item_name: 'Wooden Shield',     item_desc: 'A basic shield for deflecting blows.',   item_type_use: 8,  item_quality: 3, item_power: 1,  item_duration: 100, item_duration_max: 100, item_price: 25,    item_weight: 10, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 15, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 15, item_name: 'Winged Helm',       item_desc: 'A helm adorned with wings for speed.',   item_type_use: 9,  item_quality: 4, item_power: 1,  item_duration: 100, item_duration_max: 100, item_price: 25,    item_weight: 5,  item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 5,  item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 16, item_name: 'Leather Gloves',    item_desc: 'Simple gloves that improve grip.',       item_type_use: 10, item_quality: 1, item_power: 1,  item_duration: 100, item_duration_max: 100, item_price: 15,    item_weight: 5,  item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 10, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 17, item_name: 'Iron Sword',        item_desc: 'A reliable iron sword for combat.',      item_type_use: 5,  item_quality: 4, item_power: 1,  item_duration: 100, item_duration_max: 100, item_price: 35,    item_weight: 5,  item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 10, item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 18, item_name: 'Iron Flail',        item_desc: 'A heavy flail with crushing power.',    item_type_use: 5,  item_quality: 6, item_power: 5,  item_duration: 250, item_duration_max: 250, item_price: 100,   item_weight: 12, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 15, item_add_power: 0, item_mp_use: 0, item_element: 0, item_restrict_level: 3, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 19, item_name: 'Elven Bow',         item_desc: 'A finely crafted elven bow.',           item_type_use: 5,  item_quality: 4, item_power: 10, item_duration: 300, item_duration_max: 300, item_price: 150,   item_weight: 15, item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 20, item_add_power: 0, item_mp_use: 0, item_element: 0, item_restrict_level: 5, item_restrict_class_enable: 1, item_restrict_class: '4,5,9,10,', item_restrict_race_enable: 1, item_restrict_race: '1,2,4,', item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 75 },
		{ item_id: 20, item_name: 'Health Potion',     item_desc: 'Restores 10 HP when consumed.',         item_type_use: 15, item_quality: 1, item_power: 10, item_duration: 5,   item_duration_max: 5,   item_price: 10,    item_weight: 3,  item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 0,  item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 5 },
		{ item_id: 21, item_name: 'Mana Potion',       item_desc: 'Restores 10 MP when consumed.',         item_type_use: 16, item_quality: 4, item_power: 10, item_duration: 5,   item_duration_max: 5,   item_price: 10,    item_weight: 3,  item_in_shop: 1, item_store_id: 1, item_owner_id: 0, item_auth: 0, item_max_skill: 0,  item_add_power: 0, item_mp_use: 0, item_element: 0, item_crit_hit: 20, item_crit_hit_mod: 2, item_sell_back_percentage: 5 },
	];
	for (const item of defaultItems) {
		if (!item.item_restrict_align_enable) item.item_restrict_align_enable = 0;
		if (!item.item_restrict_align)        item.item_restrict_align = '0';
		if (!item.item_restrict_class_enable) item.item_restrict_class_enable = 0;
		if (!item.item_restrict_class)        item.item_restrict_class = '0';
		if (!item.item_restrict_element_enable) item.item_restrict_element_enable = 0;
		if (!item.item_restrict_element)      item.item_restrict_element = '0';
		if (!item.item_restrict_race_enable)  item.item_restrict_race_enable = 0;
		if (!item.item_restrict_race)         item.item_restrict_race = '0';
		if (!item.item_restrict_level)        item.item_restrict_level = 0;
		item.item_stolen_id = 0;
		item.item_steal_dc = 0;
		item.item_bought_timestamp = 0;
		await db.setObject('adr:item:' + item.item_id, item);
		await db.sortedSetAdd('adr:items', item.item_id, item.item_id);
		await db.sortedSetAdd('adr:items:store:' + item.item_store_id, item.item_id, item.item_id);
	}
	await db.setObjectField('global', 'nextAdrItemId', defaultItems.length);
};

Data.seedStocks = async function () {
	const stocks = [
		{ stock_id: 1, stock_name: 'Dragon\'s Rest INN', stock_desc: 'Shares in the famous adventurer\'s inn.',   stock_price: 113, stock_previous_price: 108, stock_best_price: 113, stock_worst_price: 100 },
		{ stock_id: 2, stock_name: 'Mage\'s Tower Corp.',  stock_desc: 'Shares in the tower of arcane research.',  stock_price: 177, stock_previous_price: 192, stock_best_price: 200, stock_worst_price: 177 },
		{ stock_id: 3, stock_name: 'Ironclad Smithery',   stock_desc: 'Shares in the legendary blacksmith guild.', stock_price: 280, stock_previous_price: 288, stock_best_price: 300, stock_worst_price: 280 },
	];
	for (const s of stocks) {
		await db.setObject('adr:vault:stock:' + s.stock_id, s);
		await db.sortedSetAdd('adr:vault:stocks', s.stock_price, s.stock_id);
	}
	await db.setObjectField('global', 'nextAdrStockId', stocks.length);
};
