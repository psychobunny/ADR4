'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Inventory = require('./inventory');

const Battle = module.exports = {};

Battle.getActiveBattle = async function (uid) {
        const battleId = await db.getObjectField('adr:battles:active', uid);
        if (!battleId) return null;
        return await db.getObject('adr:battle:' + battleId);
};

Battle.canFight = async function (uid) {
        const char = await Character.getByUid(uid);
        if (!char) return { can: false, reason: 'No character' };
        if (parseInt(char.character_hp, 10) <= 0) return { can: false, reason: 'Your character is dead. Visit the Temple to resurrect.' };
        const config = await helpers.getConfig();
        if (!parseInt(config.battle_enable, 10)) return { can: false, reason: 'Battles are currently disabled.' };

        await Character.regenLimits(uid);
        const fresh = await Character.getByUid(uid);
        if (parseInt(fresh.character_battle_limit, 10) <= 0) return { can: false, reason: 'You have used all your battles for today. Come back tomorrow.' };

        return { can: true };
};

Battle.getEligibleMonsters = async function (uid) {
        const char     = await Character.getByUid(uid);
        if (!char) return [];
        const level    = parseInt(char.character_level, 10);
        const config   = await helpers.getConfig();
        const modifier = parseInt(config.battle_monster_stats_modifier, 10) || 150;

        const monsterIds = await db.getSortedSetRange('adr:monsters', 0, -1);
        const monsters   = await db.getObjects(monsterIds.map(id => 'adr:monster:' + id));

        return monsters.filter(m => m && parseInt(m.monster_level, 10) <= level + 2).map(m => ({
                ...m,
                monster_hp:  Math.floor(parseInt(m.monster_base_hp, 10) * modifier / 100 * level),
                monster_att: Math.floor(parseInt(m.monster_base_att, 10) * modifier / 100),
                monster_def: Math.floor(parseInt(m.monster_base_def, 10) * modifier / 100),
        }));
};

Battle.startBattle = async function (uid, monsterId) {
        const check = await Battle.canFight(uid);
        if (!check.can) throw new Error(check.reason);

        const char    = await Character.getByUid(uid);
        const monster = await helpers.getMonster(monsterId);
        if (!monster) throw new Error('Monster not found');

        const config   = await helpers.getConfig();
        const modifier = parseInt(config.battle_monster_stats_modifier, 10) || 150;
        const level    = parseInt(char.character_level, 10);

        const monsterHp  = Math.max(5, Math.floor(parseInt(monster.monster_base_hp, 10) * modifier / 100 * level));
        const monsterAtt = Math.floor(parseInt(monster.monster_base_att, 10) * modifier / 100);
        const monsterDef = Math.floor(parseInt(monster.monster_base_def, 10) * modifier / 100);
        const monsterMp  = parseInt(monster.monster_base_mp, 10) || 10;
        const monsterMpPower = parseInt(monster.monster_base_mp_power, 10) || 1;

        const charStats = await helpers.calcBattleStats(uid);
        if (!charStats) throw new Error('Could not calculate battle stats');

        const battleId = await db.incrObjectField('global', 'nextAdrBattleId');
        const now      = Math.floor(Date.now() / 1000);

        const battleData = {
                battle_id:          battleId,
                battle_type:        0,
                battle_result:      0,
                battle_turn:        0,
                battle_round:       0,
                battle_start:       now,
                battle_finish:      0,
                battle_text:        '',
                battle_challenger_id:              uid,
                battle_challenger_hp:              charStats.hp,
                battle_challenger_hp_max:          charStats.hp,
                battle_challenger_mp:              charStats.mp,
                battle_challenger_mp_max:          charStats.mp,
                battle_challenger_att:             charStats.att,
                battle_challenger_def:             charStats.def,
                battle_challenger_magic_attack:    charStats.magAt,
                battle_challenger_magic_resistance:charStats.magRe,
                battle_challenger_dmg:             0,
                battle_challenger_element:         charStats.element,
                battle_opponent_id:                parseInt(monsterId, 10),
                battle_opponent_hp:                monsterHp,
                battle_opponent_hp_max:            monsterHp,
                battle_opponent_mp:                monsterMp,
                battle_opponent_mp_max:            monsterMp,
                battle_opponent_att:               monsterAtt,
                battle_opponent_def:               monsterDef,
                battle_opponent_magic_attack:      parseInt(monster.monster_base_magic_attack, 10),
                battle_opponent_magic_resistance:  parseInt(monster.monster_base_magic_resistance, 10),
                battle_opponent_mp_power:          monsterMpPower,
                battle_opponent_sp:                parseInt(monster.monster_base_sp, 10) || 0,
                battle_opponent_dmg:               0,
                battle_opponent_element:           parseInt(monster.monster_base_element, 10),
        };

        await db.setObject('adr:battle:' + battleId, battleData);
        await db.sortedSetAdd('adr:battles', now, battleId);
        await db.sortedSetAdd('adr:battles:user:' + uid, now, battleId);
        await db.setObjectField('adr:battles:active', uid, battleId);

        await db.incrObjectFieldBy('adr:character:' + uid, 'character_battle_limit', -1);

        return battleData;
};

/* ── Load an item from the user's bag by item_id ── */
async function getItemFromBag(uid, itemId) {
        if (!itemId) return null;
        const userItems = await Inventory.getUserItems(uid);
        return userItems.find(it => String(it.item_id) === String(itemId)) || null;
}

/*
 * options = {
 *   action:   'attack' | 'magic' | 'defend' | 'potion'
 *   weaponId: item_id of weapon to use (attack/defend)
 *   spellId:  item_id of spell to cast (magic)
 *   potionId: item_id of potion to drink before battle (potion)
 * }
 */
Battle.resolveBattle = async function (uid, battleId, options) {
        options = options || {};
        const action   = options.action   || 'attack';
        const weaponId = options.weaponId || null;
        const spellId  = options.spellId  || null;
        const potionId = options.potionId || null;

        const battle = await db.getObject('adr:battle:' + battleId);
        if (!battle || String(battle.battle_challenger_id) !== String(uid)) throw new Error('Invalid battle');
        if (parseInt(battle.battle_result, 10) !== 0) throw new Error('Battle already finished');

        const config    = await helpers.getConfig();
        const charStats = await helpers.calcBattleStats(uid);

        let charHp    = parseInt(battle.battle_challenger_hp, 10);
        let charMp    = parseInt(battle.battle_challenger_mp, 10);
        let monsterHp = parseInt(battle.battle_opponent_hp, 10);
        const monsterMp = parseInt(battle.battle_opponent_mp, 10);
        const monDef    = parseInt(battle.battle_opponent_def, 10);
        const monAtt    = parseInt(battle.battle_opponent_att, 10);
        const monMagAt  = parseInt(battle.battle_opponent_magic_attack, 10);
        const monMpPow  = parseInt(battle.battle_opponent_mp_power, 10);

        let charAtt  = charStats.att;
        const charDef  = charStats.def;
        const charMagAt = charStats.magAt;

        const log = [];

        /* ── 1. Pre-battle: potion drink ── */
        if (action === 'potion' && potionId) {
                const potion = await getItemFromBag(uid, potionId);
                if (potion) {
                        const power = parseInt(potion.item_power, 10) || 10;
                        const ptype = (potion.item_effect_type || potion.item_sub_type || '').toLowerCase();
                        if (ptype === 'mp') {
                                charMp = Math.min(parseInt(battle.battle_challenger_mp_max, 10), charMp + power);
                                log.push(`<strong>Pre-battle:</strong> You drink ${potion.item_name} and restore <strong>${power} MP</strong>!`);
                        } else {
                                charHp = Math.min(parseInt(battle.battle_challenger_hp_max, 10), charHp + power);
                                log.push(`<strong>Pre-battle:</strong> You drink ${potion.item_name} and restore <strong>${power} HP</strong>!`);
                        }
                        try { await Inventory.removeOneFromBag(uid, potionId); } catch (_) {}
                } else {
                        log.push('Pre-battle: Potion not found in bag — attacking with fists instead.');
                }
        }

        /* ── 2. Attack boost from weapon ── */
        let weaponBonus = 0;
        let weaponName  = 'fists';
        if ((action === 'attack' || action === 'defend') && weaponId) {
                const weapon = await getItemFromBag(uid, weaponId);
                if (weapon) {
                        weaponBonus = parseInt(weapon.item_power, 10) || 0;
                        weaponName  = weapon.item_name;
                        charAtt    += weaponBonus;
                }
        }

        /* ── 3. Spell lookup ── */
        let spellPower  = charMagAt;
        let spellMpCost = 5;
        let spellName   = 'a spell';
        if (action === 'magic' && spellId) {
                const spell = await getItemFromBag(uid, spellId);
                if (spell) {
                        spellPower  = parseInt(spell.item_power, 10) || charMagAt;
                        spellMpCost = parseInt(spell.item_mp_cost, 10) || 5;
                        spellName   = spell.item_name;
                }
        }

        const elemMod    = await helpers.calcElementDmgModifier(charStats.element, parseInt(battle.battle_opponent_element, 10));
        const monElemMod = await helpers.calcElementDmgModifier(parseInt(battle.battle_opponent_element, 10), charStats.element);

        /* ── 4. Announce stance ── */
        if (action === 'defend') {
                log.push(`<em>You adopt a defensive stance — you deal less damage but take much less too.</em>`);
        } else if (action === 'attack' && weaponBonus > 0) {
                log.push(`<em>You brandish your ${weaponName} (+${weaponBonus} ATK).</em>`);
        } else if (action === 'magic') {
                log.push(`<em>You focus your magic — ${spellName} is ready to cast.</em>`);
        }

        let rounds      = 0;
        const maxRounds = 50;
        let charTotalDmg = 0;
        let monTotalDmg  = 0;

        while (charHp > 0 && monsterHp > 0 && rounds < maxRounds) {
                rounds++;

                /* ── Player turn ── */
                let charDmg;

                if (action === 'defend') {
                        /* Defensive: hit for 50%, incoming also halved */
                        charDmg = Math.max(1, Math.floor((charAtt * (0.5 + Math.random() * 0.3) - monDef * 0.5) * elemMod / 100));
                        log.push(`Round ${rounds}: You strike defensively for <strong>${charDmg}</strong> damage.`);

                } else if (action === 'magic') {
                        if (charMp >= spellMpCost) {
                                charDmg = Math.max(1, Math.floor(spellPower * elemMod / 100 * (0.8 + Math.random() * 0.4)));
                                charMp  = Math.max(0, charMp - spellMpCost);
                                log.push(`Round ${rounds}: You cast <em>${spellName}</em> for <strong>${charDmg}</strong> magic damage!`);
                        } else {
                                /* Out of MP — fall back to physical */
                                charDmg = Math.max(1, Math.floor((charAtt * (0.8 + Math.random() * 0.4) - monDef) * elemMod / 100));
                                log.push(`Round ${rounds}: Out of MP — you swing with your fists for <strong>${charDmg}</strong> damage.`);
                        }

                } else {
                        /* Standard physical attack (attack or potion) */
                        charDmg = Math.max(1, Math.floor((charAtt * (0.8 + Math.random() * 0.4) - monDef) * elemMod / 100));
                        const critRoll = helpers.rollDice(1, 20);
                        if (critRoll >= 19) {
                                charDmg = Math.floor(charDmg * 2);
                                log.push(`Round ${rounds}: <strong>Critical hit!</strong> ${weaponBonus > 0 ? weaponName : 'Your fists'} deal <strong>${charDmg}</strong> damage!`);
                        } else {
                                log.push(`Round ${rounds}: You attack with ${weaponBonus > 0 ? weaponName : 'your fists'} for <strong>${charDmg}</strong> damage.`);
                        }
                }

                monsterHp -= charDmg;
                charTotalDmg += charDmg;
                if (monsterHp <= 0) break;

                /* ── Monster turn ── */
                let monDmg;
                const monUseMagic = monsterMp > 0 && Math.random() < 0.3;
                const defending   = action === 'defend';

                if (monUseMagic) {
                        monDmg = Math.max(1, Math.floor(monMagAt * monMpPow * (0.8 + Math.random() * 0.4) / 10));
                        if (defending) {
                                monDmg = Math.max(1, Math.floor(monDmg * 0.5));
                                log.push(`Round ${rounds}: Monster casts a spell but your guard reduces it to <strong>${monDmg}</strong>!`);
                        } else {
                                log.push(`Round ${rounds}: Monster casts a spell for <strong>${monDmg}</strong> magic damage!`);
                        }
                } else {
                        monDmg = Math.max(1, Math.floor((monAtt * (0.8 + Math.random() * 0.4) - (defending ? charDef * 1.5 : charDef)) * monElemMod / 100));
                        if (defending) {
                                log.push(`Round ${rounds}: Monster attacks — your guard absorbs most of it! You take <strong>${monDmg}</strong> damage.`);
                        } else {
                                log.push(`Round ${rounds}: Monster attacks for <strong>${monDmg}</strong> damage.`);
                        }
                }

                charHp -= monDmg;
                monTotalDmg += monDmg;
        }

        /* ── Determine result ── */
        let result;
        if (charHp > 0 && monsterHp <= 0) {
                result = 1;
        } else if (charHp <= 0 && monsterHp > 0) {
                result = 2;
        } else {
                result = 3;
        }

        let xpGained   = 0;
        let goldGained = 0;

        if (result === 1) {
                const monster    = await helpers.getMonster(battle.battle_opponent_id);
                const monLevel   = monster ? parseInt(monster.monster_level, 10) : 1;
                const expMin     = parseInt(config.battle_base_exp_min, 10) || 10;
                const expMax     = parseInt(config.battle_base_exp_max, 10) || 40;
                const expMod     = parseInt(config.battle_base_exp_modifier, 10) || 120;
                const rwdMin     = parseInt(config.battle_base_reward_min, 10) || 10;
                const rwdMax     = parseInt(config.battle_base_reward_max, 10) || 40;
                const rwdMod     = parseInt(config.battle_base_reward_modifier, 10) || 120;

                xpGained   = Math.floor(helpers.rollDice(expMin, expMax) * expMod / 100 * Math.max(1, monLevel));
                goldGained = Math.floor(helpers.rollDice(rwdMin, rwdMax) * rwdMod / 100 * Math.max(1, monLevel));

                await Character.addXp(uid, xpGained);
                await Character.addGold(uid, goldGained);
                await db.incrObjectField('adr:character:' + uid, 'character_victories');
                log.push(`<strong>Victory!</strong> You earned <strong>${xpGained} XP</strong> and <strong>${goldGained} gold</strong>!`);

        } else if (result === 2) {
                await db.incrObjectField('adr:character:' + uid, 'character_defeats');
                const penaltyPct = parseInt(config.next_level_penalty, 10) || 10;
                const char       = await Character.getByUid(uid);
                const xpPenalty  = Math.floor(parseInt(char.character_xp, 10) * penaltyPct / 100);
                await db.incrObjectFieldBy('adr:character:' + uid, 'character_xp', -xpPenalty);
                await db.setObjectField('adr:character:' + uid, 'character_hp', 0);
                log.push(`<strong>Defeat!</strong> You were slain and lost <strong>${xpPenalty} XP</strong>. Visit the Temple to resurrect.`);

        } else {
                log.push('<strong>Draw!</strong> Both combatants collapse from exhaustion.');
                await db.setObjectField('adr:character:' + uid, 'character_hp', 1);
        }

        await db.setObjectField('adr:character:' + uid, 'character_hp', Math.max(0, charHp));
        await db.setObjectField('adr:character:' + uid, 'character_mp', Math.max(0, charMp));

        const now = Math.floor(Date.now() / 1000);
        await db.setObject('adr:battle:' + battleId, {
                battle_result:        result,
                battle_finish:        now,
                battle_round:         rounds,
                battle_text:          log.join('\n'),
                battle_action:        action,
                battle_challenger_hp: Math.max(0, charHp),
                battle_challenger_mp: Math.max(0, charMp),
                battle_challenger_dmg:charTotalDmg,
                battle_opponent_hp:   Math.max(0, monsterHp),
                battle_opponent_dmg:  monTotalDmg,
        });

        await db.deleteObjectField('adr:battles:active', uid);

        return { result, xpGained, goldGained, charHpFinal: Math.max(0, charHp), monHpFinal: Math.max(0, monsterHp), log, battleId };
};

Battle.flee = async function (uid, battleId) {
        const battle = await db.getObject('adr:battle:' + battleId);
        if (!battle || String(battle.battle_challenger_id) !== String(uid)) throw new Error('Invalid battle');
        if (parseInt(battle.battle_result, 10) !== 0) throw new Error('Battle already finished');

        const config = await helpers.getConfig();
        const penaltyPct = parseInt(config.next_level_penalty, 10) || 10;
        const char   = await Character.getByUid(uid);
        const xpPenalty = Math.floor(parseInt(char.character_xp, 10) * penaltyPct / 200);

        await db.incrObjectFieldBy('adr:character:' + uid, 'character_xp', -xpPenalty);
        await db.incrObjectField('adr:character:' + uid, 'character_flees');

        const now = Math.floor(Date.now() / 1000);
        await db.setObject('adr:battle:' + battleId, { battle_result: 4, battle_finish: now, battle_text: 'You fled the battle and lost ' + xpPenalty + ' XP.' });
        await db.deleteObjectField('adr:battles:active', uid);

        return { xpLost: xpPenalty };
};

Battle.getHistory = async function (uid, start, stop) {
        const ids = await db.getSortedSetRevRange('adr:battles:user:' + uid, start, stop);
        if (!ids || !ids.length) return [];
        const battles = await db.getObjects(ids.map(id => 'adr:battle:' + id));

        return Promise.all(battles.filter(Boolean).map(async b => {
                const monster = await helpers.getMonster(b.battle_opponent_id);
                b.monsterName = monster ? monster.monster_name : 'Unknown';
                b.resultLabel = ['Pending', 'Victory', 'Defeat', 'Draw', 'Fled'][parseInt(b.battle_result, 10)] || 'Unknown';
                b.dateStr     = helpers.formatTimestamp(b.battle_finish || b.battle_start);
                return b;
        }));
};

Battle.getCommunityLog = async function (start, stop) {
        const ids = await db.getSortedSetRevRange('adr:battles', start, stop);
        if (!ids || !ids.length) return [];
        const battles = await db.getObjects(ids.map(id => 'adr:battle:' + id));
        return Promise.all(battles.filter(b => b && parseInt(b.battle_result, 10) > 0).map(async b => {
                const monster = await helpers.getMonster(b.battle_opponent_id);
                const char    = await db.getObjectFields('adr:character:' + b.battle_challenger_id, ['character_name', 'character_level']);
                b.monsterName   = monster ? monster.monster_name : 'Unknown';
                b.characterName = char ? char.character_name : 'Unknown';
                b.resultLabel   = ['Pending', 'Victory', 'Defeat', 'Draw', 'Fled'][parseInt(b.battle_result, 10)] || 'Unknown';
                b.dateStr       = helpers.formatTimestamp(b.battle_finish || b.battle_start);
                return b;
        }));
};
