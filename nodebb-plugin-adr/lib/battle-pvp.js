'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');

const BattlePvp = module.exports = {};

BattlePvp.challenge = async function (challengerUid, targetUid) {
	if (String(challengerUid) === String(targetUid)) throw new Error('You cannot challenge yourself');

	const config = await helpers.getConfig();
	if (!parseInt(config.battle_pvp_enable, 10)) throw new Error('PvP battles are currently disabled');

	const challengerChar = await Character.getByUid(challengerUid);
	const targetChar     = await Character.getByUid(targetUid);

	if (!challengerChar) throw new Error('You do not have a character');
	if (!targetChar) throw new Error('Target player does not have a character');
	if (parseInt(challengerChar.character_hp, 10) <= 0) throw new Error('Your character is dead');
	if (!parseInt(targetChar.prefs_pvp_allow, 10)) throw new Error('That player has disabled PvP challenges');

	await Character.regenLimits(challengerUid);
	const freshChar = await Character.getByUid(challengerUid);
	if (parseInt(freshChar.character_battle_limit, 10) <= 0) throw new Error('You have no battles remaining today');

	const pending = await db.getSortedSetRange('adr:battles:pvp:pending:' + targetUid, 0, -1);
	const maxChallenges = parseInt(config.battle_pvp_defies_max, 10) || 5;
	if (pending.length >= maxChallenges) throw new Error('Target already has too many pending challenges');

	const existingChallenge = await db.getObjectField('adr:battles:pvp:challenge:' + challengerUid, targetUid);
	if (existingChallenge) throw new Error('You already have a pending challenge to this player');

	const now     = Math.floor(Date.now() / 1000);
	const battleId = await db.incrObjectField('global', 'nextAdrBattlePvpId');

	const challengerStats = await helpers.calcBattleStats(challengerUid);

	const battleData = {
		battle_id:          battleId,
		battle_result:      0,
		battle_turn:        0,
		battle_start:       now,
		battle_finish:      0,
		battle_text:        '',
		battle_text_chat:   '',
		battle_challenger_id:               challengerUid,
		battle_challenger_att:              challengerStats.att,
		battle_challenger_def:              challengerStats.def,
		battle_challenger_hp:               challengerStats.hp,
		battle_challenger_mp:               challengerStats.mp,
		battle_challenger_hp_max:           challengerStats.hp_max,
		battle_challenger_mp_max:           challengerStats.mp_max,
		battle_challenger_hp_regen:         Math.floor(challengerStats.hp_max * 0.05),
		battle_challenger_mp_regen:         Math.floor(challengerStats.mp_max * 0.05),
		battle_challenger_dmg:              0,
		battle_challenger_magic_attack:     challengerStats.magAt,
		battle_challenger_magic_resistance: challengerStats.magRe,
		battle_challenger_element:          challengerStats.element,
		battle_opponent_id:                 targetUid,
		battle_opponent_att:                0,
		battle_opponent_def:                0,
		battle_opponent_hp:                 0,
		battle_opponent_mp:                 0,
		battle_opponent_hp_max:             0,
		battle_opponent_mp_max:             0,
		battle_opponent_hp_regen:           0,
		battle_opponent_mp_regen:           0,
		battle_opponent_dmg:                0,
		battle_opponent_magic_attack:       0,
		battle_opponent_magic_resistance:   0,
		battle_opponent_element:            0,
	};

	await db.setObject('adr:battle:pvp:' + battleId, battleData);
	await db.sortedSetAdd('adr:battles:pvp', now, battleId);
	await db.sortedSetAdd('adr:battles:pvp:pending:' + targetUid, now, battleId);
	await db.sortedSetAdd('adr:battles:pvp:sent:' + challengerUid, now, battleId);
	await db.setObjectField('adr:battles:pvp:challenge:' + challengerUid, targetUid, battleId);

	await db.incrObjectFieldBy('adr:character:' + challengerUid, 'character_battle_limit', -1);

	return battleData;
};

BattlePvp.accept = async function (targetUid, battleId) {
	const battle = await db.getObject('adr:battle:pvp:' + battleId);
	if (!battle) throw new Error('Challenge not found');
	if (String(battle.battle_opponent_id) !== String(targetUid)) throw new Error('Not your challenge');
	if (parseInt(battle.battle_result, 10) !== 0) throw new Error('Challenge already resolved');

	const targetChar   = await Character.getByUid(targetUid);
	if (!targetChar) throw new Error('No character');
	if (parseInt(targetChar.character_hp, 10) <= 0) throw new Error('Your character is dead');

	const targetStats  = await helpers.calcBattleStats(targetUid);

	await db.setObject('adr:battle:pvp:' + battleId, {
		battle_opponent_att:              targetStats.att,
		battle_opponent_def:              targetStats.def,
		battle_opponent_hp:               targetStats.hp,
		battle_opponent_mp:               targetStats.mp,
		battle_opponent_hp_max:           targetStats.hp_max,
		battle_opponent_mp_max:           targetStats.mp_max,
		battle_opponent_hp_regen:         Math.floor(targetStats.hp_max * 0.05),
		battle_opponent_mp_regen:         Math.floor(targetStats.mp_max * 0.05),
		battle_opponent_magic_attack:     targetStats.magAt,
		battle_opponent_magic_resistance: targetStats.magRe,
		battle_opponent_element:          targetStats.element,
	});

	await db.sortedSetRemove('adr:battles:pvp:pending:' + targetUid, battleId);

	return await BattlePvp.resolve(battle.battle_challenger_id, targetUid, battleId);
};

BattlePvp.decline = async function (targetUid, battleId) {
	const battle = await db.getObject('adr:battle:pvp:' + battleId);
	if (!battle || String(battle.battle_opponent_id) !== String(targetUid)) throw new Error('Invalid challenge');

	const now = Math.floor(Date.now() / 1000);
	await db.setObject('adr:battle:pvp:' + battleId, { battle_result: 5, battle_finish: now, battle_text: 'Challenge declined.' });
	await db.sortedSetRemove('adr:battles:pvp:pending:' + targetUid, battleId);
	await db.deleteObjectField('adr:battles:pvp:challenge:' + battle.battle_challenger_id, targetUid);
};

BattlePvp.resolve = async function (challengerUid, targetUid, battleId) {
	const battle = await db.getObject('adr:battle:pvp:' + battleId);
	if (!battle) throw new Error('Battle not found');

	const config    = await helpers.getConfig();
	let chHp  = parseInt(battle.battle_challenger_hp, 10);
	let opHp  = parseInt(battle.battle_opponent_hp, 10);
	let chMp  = parseInt(battle.battle_challenger_mp, 10);
	let opMp  = parseInt(battle.battle_opponent_mp, 10);
	const chAtt  = parseInt(battle.battle_challenger_att, 10);
	const chDef  = parseInt(battle.battle_challenger_def, 10);
	const opAtt  = parseInt(battle.battle_opponent_att, 10);
	const opDef  = parseInt(battle.battle_opponent_def, 10);
	const chMagAt = parseInt(battle.battle_challenger_magic_attack, 10);
	const opMagAt = parseInt(battle.battle_opponent_magic_attack, 10);
	const chRegen = parseInt(battle.battle_challenger_hp_regen, 10);
	const opRegen = parseInt(battle.battle_opponent_hp_regen, 10);
	const chMpReg = parseInt(battle.battle_challenger_mp_regen, 10);
	const opMpReg = parseInt(battle.battle_opponent_mp_regen, 10);

	const chElemMod = await helpers.calcElementDmgModifier(battle.battle_challenger_element, battle.battle_opponent_element);
	const opElemMod = await helpers.calcElementDmgModifier(battle.battle_opponent_element, battle.battle_challenger_element);

	const log = [];
	let rounds = 0;
	const maxRounds = 50;
	let chTotalDmg = 0;
	let opTotalDmg = 0;

	const chChar = await db.getObjectFields('adr:character:' + challengerUid, ['character_name']);
	const opChar = await db.getObjectFields('adr:character:' + targetUid, ['character_name']);
	const chName = chChar ? chChar.character_name : 'Challenger';
	const opName = opChar ? opChar.character_name : 'Opponent';

	while (chHp > 0 && opHp > 0 && rounds < maxRounds) {
		rounds++;
		chMp = Math.min(parseInt(battle.battle_challenger_mp_max, 10), chMp + chMpReg);
		opMp = Math.min(parseInt(battle.battle_opponent_mp_max, 10), opMp + opMpReg);

		let chDmg;
		if (chMp >= 10 && Math.random() < 0.4) {
			chDmg = Math.max(1, Math.floor(chMagAt * (0.8 + Math.random() * 0.4) * chElemMod / 100));
			chMp -= 10;
			log.push(`Round ${rounds}: ${chName} casts a spell for <strong>${chDmg}</strong> magic damage!`);
		} else {
			chDmg = Math.max(1, Math.floor((chAtt * (0.8 + Math.random() * 0.4) - opDef) * chElemMod / 100));
			log.push(`Round ${rounds}: ${chName} attacks for <strong>${chDmg}</strong> damage.`);
		}
		opHp -= chDmg;
		chTotalDmg += chDmg;

		if (opHp <= 0) break;

		let opDmg;
		if (opMp >= 10 && Math.random() < 0.4) {
			opDmg = Math.max(1, Math.floor(opMagAt * (0.8 + Math.random() * 0.4) * opElemMod / 100));
			opMp -= 10;
			log.push(`Round ${rounds}: ${opName} casts a spell for <strong>${opDmg}</strong> magic damage!`);
		} else {
			opDmg = Math.max(1, Math.floor((opAtt * (0.8 + Math.random() * 0.4) - chDef) * opElemMod / 100));
			log.push(`Round ${rounds}: ${opName} attacks for <strong>${opDmg}</strong> damage.`);
		}
		chHp -= opDmg;
		opTotalDmg += opDmg;

		if (chHp > 0) chHp = Math.min(parseInt(battle.battle_challenger_hp_max, 10), chHp + chRegen);
		if (opHp > 0) opHp = Math.min(parseInt(battle.battle_opponent_hp_max, 10), opHp + opRegen);
	}

	const doubleKo = chHp <= 0 && opHp <= 0;
	let result;
	let winnerId = null;
	let loserId  = null;

	if (doubleKo) {
		result = 3;
		await db.incrObjectField('adr:character:' + challengerUid, 'character_double_ko');
		await db.incrObjectField('adr:character:' + targetUid, 'character_double_ko');
		log.push('<strong>Double KO!</strong> Both combatants fell simultaneously!');
	} else if (chHp > 0) {
		result   = 1;
		winnerId = challengerUid;
		loserId  = targetUid;
	} else {
		result   = 2;
		winnerId = targetUid;
		loserId  = challengerUid;
	}

	if (winnerId) {
		const expMin   = parseInt(config.pvp_base_exp_min, 10) || 10;
		const expMax   = parseInt(config.pvp_base_exp_max, 10) || 40;
		const expMod   = parseInt(config.pvp_base_exp_modifier, 10) || 120;
		const rwdMin   = parseInt(config.pvp_base_reward_min, 10) || 10;
		const rwdMax   = parseInt(config.pvp_base_reward_max, 10) || 40;
		const rwdMod   = parseInt(config.pvp_base_reward_modifier, 10) || 120;
		const xpGained = Math.floor(helpers.rollDice(expMin, expMax) * expMod / 100);
		const goldWon  = Math.floor(helpers.rollDice(rwdMin, rwdMax) * rwdMod / 100);

		await Character.addXp(winnerId, xpGained);
		await Character.addGold(winnerId, goldWon);
		await db.incrObjectField('adr:character:' + winnerId, 'character_victories_pvp');
		await db.incrObjectField('adr:character:' + loserId,  'character_defeats_pvp');

		const winnerName = winnerId === challengerUid ? chName : opName;
		log.push(`<strong>${winnerName} wins!</strong> Earned ${xpGained} XP and ${goldWon} gold.`);
	}

	await db.setObjectField('adr:character:' + challengerUid, 'character_hp', Math.max(0, chHp));
	await db.setObjectField('adr:character:' + targetUid, 'character_hp', Math.max(0, opHp));

	const now = Math.floor(Date.now() / 1000);
	await db.setObject('adr:battle:pvp:' + battleId, {
		battle_result:         result,
		battle_finish:         now,
		battle_turn:           rounds,
		battle_text:           log.join('\n'),
		battle_challenger_hp:  Math.max(0, chHp),
		battle_challenger_dmg: chTotalDmg,
		battle_opponent_hp:    Math.max(0, opHp),
		battle_opponent_dmg:   opTotalDmg,
	});

	await db.sortedSetAdd('adr:battles:pvp:user:' + challengerUid, now, battleId);
	await db.sortedSetAdd('adr:battles:pvp:user:' + targetUid, now, battleId);
	await db.deleteObjectField('adr:battles:pvp:challenge:' + challengerUid, targetUid);

	return { result, log, battleId, doubleKo };
};

BattlePvp.getPendingChallenges = async function (uid) {
	const ids    = await db.getSortedSetRange('adr:battles:pvp:pending:' + uid, 0, -1);
	if (!ids || !ids.length) return [];
	const battles = await db.getObjects(ids.map(id => 'adr:battle:pvp:' + id));
	return Promise.all(battles.filter(Boolean).map(async b => {
		const char = await db.getObjectFields('adr:character:' + b.battle_challenger_id, ['character_name', 'character_level']);
		b.challengerName = char ? char.character_name : 'Unknown';
		b.challengerLevel = char ? char.character_level : 0;
		b.dateStr = helpers.formatTimestamp(b.battle_start);
		return b;
	}));
};

BattlePvp.getHistory = async function (uid, start, stop) {
	const ids    = await db.getSortedSetRevRange('adr:battles:pvp:user:' + uid, start, stop);
	if (!ids || !ids.length) return [];
	const battles = await db.getObjects(ids.map(id => 'adr:battle:pvp:' + id));
	return Promise.all(battles.filter(Boolean).map(async b => {
		const ch = await db.getObjectFields('adr:character:' + b.battle_challenger_id, ['character_name']);
		const op = await db.getObjectFields('adr:character:' + b.battle_opponent_id, ['character_name']);
		b.challengerName = ch ? ch.character_name : 'Unknown';
		b.opponentName   = op ? op.character_name : 'Unknown';
		b.resultLabel = ['Pending','Challenger Wins','Opponent Wins','Draw','Fled','Declined'][parseInt(b.battle_result,10)] || '?';
		b.dateStr = helpers.formatTimestamp(b.battle_finish || b.battle_start);
		b.isChallenger = String(b.battle_challenger_id) === String(uid);
		return b;
	}));
};
