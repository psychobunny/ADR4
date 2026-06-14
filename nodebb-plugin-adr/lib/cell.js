'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');

const Cell = module.exports = {};

Cell.isJailed = async function (uid) {
	const jail = await db.getObject('adr:jail:' + uid);
	if (!jail) return false;
	const sentence = parseInt(jail.user_sentence, 10) || 0;
	if (sentence <= 0) return false;
	const now    = Math.floor(Date.now() / 1000);
	const freed  = parseInt(jail.user_freed_by, 10) || 0;
	if (freed > 0 && freed <= now) return false;
	return true;
};

Cell.getJailRecord = async function (uid) {
	return await db.getObject('adr:jail:' + uid);
};

Cell.jail = async function (targetUid, sentence, caution, punishment, imposedBy) {
	const now      = Math.floor(Date.now() / 1000);
	const jailData = {
		user_cell_date:  now,
		user_freed_by:   now + (parseInt(sentence, 10) || 3600),
		user_sentence:   parseInt(sentence, 10) || 3600,
		user_caution:    String(caution || '').substring(0, 500),
		user_time:       parseInt(sentence, 10) || 3600,
		user_punishment: String(punishment || ''),
		imposed_by:      imposedBy || 0,
	};
	await db.setObject('adr:jail:' + targetUid, jailData);
	await db.sortedSetAdd('adr:jail:active', now + jailData.user_sentence, targetUid);
};

Cell.release = async function (uid) {
	await db.setObjectField('adr:jail:' + uid, 'user_sentence', 0);
	await db.sortedSetRemove('adr:jail:active', uid);
};

Cell.getActiveJailedUsers = async function () {
	const now  = Math.floor(Date.now() / 1000);
	const uids = await db.getSortedSetRangeByScore('adr:jail:active', now, '+inf', 0, 50);
	if (!uids || !uids.length) return [];
	const records = await Promise.all(uids.map(uid => Cell.getJailRecord(uid)));
	const User = require.main.require('./src/user');
	const users = await User.getUsersFields(uids, ['username', 'userslug']);
	return records.map((r, i) => r ? { ...r, uid: uids[i], username: users[i] ? users[i].username : '?', userslug: users[i] ? users[i].userslug : '' } : null).filter(Boolean);
};

Cell.buyFreedom = async function (uid) {
	const config  = await helpers.getConfig();
	if (!parseInt(config.cell_allow_user_blank, 10)) throw new Error('Buying freedom is disabled');

	const cost = parseInt(config.cell_amount_user_blank, 10) || 5000;
	await Character.deductGold(uid, cost);
	await Cell.release(uid);

	return cost;
};

Cell.checkExpiredSentences = async function () {
	const now  = Math.floor(Date.now() / 1000);
	const uids = await db.getSortedSetRangeByScore('adr:jail:active', 0, now, 0, 100);
	for (const uid of uids) {
		await Cell.release(uid);
	}
};
