'use strict';

const nconf   = require.main.require('nconf');
const Character = require('./character');
const helpers   = require('./helpers');

const middleware = module.exports = {};

middleware.requireCharacter = async function (req, res, next) {
	if (!req.uid || req.uid === 0) {
		return res.redirect(nconf.get('relative_path') + '/login?redirect=' + encodeURIComponent(req.url));
	}
	const config = await helpers.getConfig();
	if (parseInt(config.disable_rpg, 10)) {
		return res.render('error', { status: 403, error: 'The RPG is currently disabled by an administrator.' });
	}
	const exists = await Character.exists(req.uid);
	if (!exists) {
		return res.redirect(nconf.get('relative_path') + '/adr/character/create');
	}
	next();
};

middleware.requireAdmin = function (req, res, next) {
	if (!req.uid || !res.locals.isAdmin) {
		return res.status(403).render('error', { status: 403, error: 'Administrators only.' });
	}
	next();
};

middleware.requireLogin = function (req, res, next) {
	if (!req.uid || req.uid === 0) {
		return res.redirect(nconf.get('relative_path') + '/login?redirect=' + encodeURIComponent(req.url));
	}
	next();
};

middleware.notJailed = async function (req, res, next) {
	const Cell = require('./cell');
	const jailed = await Cell.isJailed(req.uid);
	if (jailed) {
		return res.redirect(nconf.get('relative_path') + '/adr/cell');
	}
	next();
};

middleware.notDead = async function (req, res, next) {
	const char = await Character.getByUid(req.uid);
	if (!char || parseInt(char.character_hp, 10) <= 0) {
		return res.redirect(nconf.get('relative_path') + '/adr/temple');
	}
	next();
};
