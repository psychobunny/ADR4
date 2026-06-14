'use strict';

const plugin = module.exports = {};

const db = require.main.require('./src/database');
const User = require.main.require('./src/user');

const routes    = require('./lib/routes');
const Character = require('./lib/character');
const helpers   = require('./lib/helpers');

plugin.init = async function (params) {
	const { router, middleware } = params;
	routes.init(router, middleware);
	await plugin.ensureDefaults();
};

plugin.ensureDefaults = async function () {
	const exists = await db.exists('adr:config');
	if (exists) return;

	await db.setObject('adr:config', {
		disable_rpg: 0,
		battle_enable: 1,
		battle_pvp_enable: 1,
		battle_calc_type: 1,
		battle_base_exp_min: 10,
		battle_base_exp_max: 40,
		battle_base_exp_modifier: 120,
		battle_base_reward_min: 10,
		battle_base_reward_max: 40,
		battle_base_reward_modifier: 120,
		battle_base_sp_modifier: 120,
		battle_monster_stats_modifier: 150,
		battle_pvp_defies_max: 5,
		character_battle_limit: 20,
		character_skill_limit: 30,
		character_trading_limit: 30,
		character_thief_limit: 10,
		character_limit_enable: 1,
		limit_regen_duration: 1,
		character_age: 16,
		allow_character_delete: 1,
		allow_reroll: 1,
		max_characteristic: 20,
		min_characteristic: 3,
		experience_for_new: 10,
		experience_for_reply: 5,
		experience_for_edit: 1,
		temple_heal_cost: 100,
		temple_resurrect_cost: 300,
		vault_enable: 1,
		vault_loan_enable: 1,
		loan_max_sum: 5000,
		loan_interests: 15,
		loan_interests_time: 864000,
		interests_rate: 4,
		interests_time: 86400,
		shop_tax: 10,
		warehouse_tax: 10,
		shop_duration: 1,
		warehouse_duration: 1,
		new_shop_price: 500,
		allow_shop_steal: 1,
		shop_steal_min_lvl: 5,
		skill_thief_failure_damage: 2000,
		skill_thief_failure_punishment: 1,
		skill_thief_failure_time: 6,
		skill_thief_failure_type: 2,
		skill_trading_power: 2,
		thief_enable: 1,
		thief_points: 5,
		stock_use: 1,
		stock_time: 86400,
		stock_min_change: 0,
		stock_max_change: 10,
		cell_allow_user_blank: 1,
		cell_allow_user_caution: 1,
		cell_allow_user_judge: 1,
		cell_amount_user_blank: 5000,
		cell_user_judge_posts: 2,
		cell_user_judge_voters: 10,
		next_level_penalty: 10,
		training_allow_change: 1,
		training_change_cost: 100,
		training_charac_cost: 3000,
		training_skill_cost: 1000,
		training_upgrade_cost: 10000,
		item_power_level: 0,
		item_modifier_power: 100,
		weight_enable: 1,
		pvp_base_exp_min: 10,
		pvp_base_exp_max: 40,
		pvp_base_exp_modifier: 120,
		pvp_base_reward_min: 10,
		pvp_base_reward_max: 40,
		pvp_base_reward_modifier: 120,
	});

	await require('./lib/data').seedAll();
};

plugin.adminBuildHeader = async function (custom_header) {
	custom_header.plugins.push({
		route: '/plugins/adr',
		icon: 'fa-dragon',
		name: 'ADR - RPG',
	});
	return custom_header;
};

plugin.addCharacterCardToPost = async function (data) {
	const postData = data.postData;
	if (!postData || !postData.uid) return data;

	try {
		const char = await Character.getByUid(postData.uid);
		if (char && char.character_name) {
			const raceData  = await helpers.getRace(char.character_race);
			const classData = await helpers.getClass(char.character_class);
			const elemData  = await helpers.getElement(char.character_element);
			const alignData = await helpers.getAlignment(char.character_alignment);

			const raceName  = raceData  ? raceData.race_name   : 'Unknown';
			const className = classData ? classData.class_name  : 'Unknown';
			const elemName  = elemData  ? elemData.element_name : 'Unknown';
			const alignName = alignData ? alignData.alignment_name : 'Unknown';

			const hpPct = char.character_hp_max > 0
				? Math.round((char.character_hp / char.character_hp_max) * 100)
				: 0;
			const mpPct = char.character_mp_max > 0
				? Math.round((char.character_mp / char.character_mp_max) * 100)
				: 0;

			const card = `
<div class="adr-post-character-card" data-uid="${postData.uid}">
  <div class="adr-card-header">
    <span class="adr-char-name">${helpers.escape(char.character_name)}</span>
    <span class="adr-char-level">Lv.${char.character_level}</span>
  </div>
  <div class="adr-card-body">
    <div class="adr-card-row">
      <span class="adr-label">Class</span>
      <span>${helpers.escape(className)}</span>
    </div>
    <div class="adr-card-row">
      <span class="adr-label">Race</span>
      <span>${helpers.escape(raceName)}</span>
    </div>
    <div class="adr-card-row">
      <span class="adr-label">Element</span>
      <span>${helpers.escape(elemName)}</span>
    </div>
    <div class="adr-card-row">
      <span class="adr-label">Alignment</span>
      <span>${helpers.escape(alignName)}</span>
    </div>
    <div class="adr-card-bars">
      <div class="adr-bar-label">HP ${char.character_hp}/${char.character_hp_max}</div>
      <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:${hpPct}%"></div></div>
      <div class="adr-bar-label">MP ${char.character_mp}/${char.character_mp_max}</div>
      <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:${mpPct}%"></div></div>
    </div>
    <div class="adr-card-gold">
      <span class="adr-label">Gold</span>
      <span>${parseInt(char.character_gold || 0, 10).toLocaleString()}</span>
    </div>
    <div class="adr-card-record">
      W:${char.character_victories || 0} / L:${char.character_defeats || 0} / F:${char.character_flees || 0}
    </div>
  </div>
  <div class="adr-card-footer">
    <a href="/adr/character/${postData.uid}" class="adr-card-link">View Sheet</a>
  </div>
</div>`;

			data.postData.content += card;
		}
	} catch (e) {
	}

	return data;
};

plugin.onUserCreate = async function (data) {
	return data;
};
