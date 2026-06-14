'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');
const Cell      = require('./cell');

const Courthouse = module.exports = {};

Courthouse.getCases = async function () {
	const uids = await db.getSortedSetRevRange('adr:jail:active', 0, -1);
	if (!uids || !uids.length) return [];
	const User = require.main.require('./src/user');
	const results = [];
	for (const uid of uids) {
		const jail  = await Cell.getJailRecord(uid);
		if (!jail) continue;
		const user  = await User.getUserFields(uid, ['username', 'userslug']);
		const char  = await db.getObjectFields('adr:character:' + uid, ['character_name', 'character_level']);
		const votes = await Courthouse.getVoteSummary(uid);
		results.push({
			...jail,
			uid,
			username:  user ? user.username : '?',
			userslug:  user ? user.userslug : '',
			charName:  char ? char.character_name : '?',
			charLevel: char ? char.character_level : 0,
			...votes,
			dateStr: helpers.formatTimestamp(jail.user_cell_date),
		});
	}
	return results;
};

Courthouse.getVoteSummary = async function (jailedUid) {
	const keys   = await db.getSortedSetRange('adr:jail:votes:' + jailedUid, 0, -1);
	let free = 0, keep = 0;
	for (const key of keys) {
		const vote = await db.getObjectField('adr:jail:votes:' + jailedUid, key);
		if (vote === 'free') free++;
		else keep++;
	}
	return { voteFree: free, voteKeep: keep, totalVotes: free + keep };
};

Courthouse.submitVote = async function (voterUid, jailedUid, decision) {
	const config     = await helpers.getConfig();
	if (!parseInt(config.cell_allow_user_judge, 10)) throw new Error('Community judging is disabled');

	const char = await Character.getByUid(voterUid);
	if (!char) throw new Error('You need a character to vote');

	const minPosts = parseInt(config.cell_user_judge_posts, 10) || 2;
	const User = require.main.require('./src/user');
	const userData = await User.getUserFields(voterUid, ['postcount']);
	if ((userData.postcount || 0) < minPosts) throw new Error(`You need at least ${minPosts} posts to vote`);

	const alreadyVoted = await db.getObjectField('adr:jail:votes:' + jailedUid, voterUid);
	if (alreadyVoted) throw new Error('You have already voted on this case');

	if (!['free', 'keep'].includes(decision)) throw new Error('Invalid vote');

	await db.setObjectField('adr:jail:votes:' + jailedUid, voterUid, decision);
	await db.sortedSetAdd('adr:jail:votes:' + jailedUid, Date.now() / 1000, voterUid);

	const summary   = await Courthouse.getVoteSummary(jailedUid);
	const threshold = parseInt(config.cell_user_judge_voters, 10) || 10;

	if (summary.totalVotes >= threshold) {
		if (summary.voteFree > summary.voteKeep) {
			await Cell.release(jailedUid);
		}
	}

	return summary;
};

Courthouse.hasVoted = async function (voterUid, jailedUid) {
	const vote = await db.getObjectField('adr:jail:votes:' + jailedUid, voterUid);
	return vote !== null && vote !== undefined;
};

Courthouse.adminJail = async function (targetUid, sentence, caution, adminUid) {
	await Cell.jail(targetUid, sentence, caution, 'admin', adminUid);
};

Courthouse.adminRelease = async function (targetUid) {
	await Cell.release(targetUid);
};
