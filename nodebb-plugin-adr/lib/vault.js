'use strict';

const db        = require.main.require('./src/database');
const helpers   = require('./helpers');
const Character = require('./character');

const Vault = module.exports = {};

Vault.getAccount = async function (uid) {
	const data = await db.getObject('adr:vault:' + uid);
	return data || {
		account_sum: 0, account_time: 0,
		loan_sum: 0,    loan_time: 0,
		account_protect: 0, loan_protect: 0,
	};
};

Vault.deposit = async function (uid, amount) {
	const config = await helpers.getConfig();
	if (!parseInt(config.vault_enable, 10)) throw new Error('Vault is disabled');

	amount = parseInt(amount, 10);
	if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');

	await Character.deductGold(uid, amount);

	const now     = Math.floor(Date.now() / 1000);
	const account = await Vault.getAccount(uid);
	const current = parseInt(account.account_sum, 10) || 0;

	await db.setObject('adr:vault:' + uid, {
		account_sum:  current + amount,
		account_time: now,
	});

	return current + amount;
};

Vault.withdraw = async function (uid, amount) {
	const config = await helpers.getConfig();
	if (!parseInt(config.vault_enable, 10)) throw new Error('Vault is disabled');

	amount = parseInt(amount, 10);
	if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');

	const account = await Vault.getAccount(uid);
	const current = parseInt(account.account_sum, 10) || 0;

	if (current < amount) throw new Error('Insufficient vault balance');

	await db.setObjectField('adr:vault:' + uid, 'account_sum', current - amount);
	await Character.addGold(uid, amount);

	return current - amount;
};

Vault.accrueInterest = async function (uid) {
	const config  = await helpers.getConfig();
	const account = await Vault.getAccount(uid);
	const now     = Math.floor(Date.now() / 1000);
	const rate    = parseInt(config.interests_rate, 10) || 4;
	const period  = parseInt(config.interests_time, 10) || 86400;

	if (account.account_sum > 0 && account.account_time) {
		const elapsed = now - parseInt(account.account_time, 10);
		const periods = Math.floor(elapsed / period);
		if (periods > 0) {
			const interest = Math.floor(parseInt(account.account_sum, 10) * rate / 100 * periods);
			await db.setObject('adr:vault:' + uid, {
				account_sum:  parseInt(account.account_sum, 10) + interest,
				account_time: now,
			});
		}
	}

	if (account.loan_sum > 0 && account.loan_time) {
		const loanRate   = parseInt(config.loan_interests, 10) || 15;
		const loanPeriod = parseInt(config.loan_interests_time, 10) || 864000;
		const elapsed    = now - parseInt(account.loan_time, 10);
		const periods    = Math.floor(elapsed / loanPeriod);
		if (periods > 0) {
			const interest = Math.floor(parseInt(account.loan_sum, 10) * loanRate / 100 * periods);
			await db.setObject('adr:vault:' + uid, {
				loan_sum:  parseInt(account.loan_sum, 10) + interest,
				loan_time: now,
			});
		}
	}
};

Vault.takeLoan = async function (uid, amount) {
	const config = await helpers.getConfig();
	if (!parseInt(config.vault_loan_enable, 10)) throw new Error('Loans are disabled');

	const blacklisted = await db.isSetMember('adr:vault:blacklist', uid);
	if (blacklisted) throw new Error('You are blacklisted from taking loans');

	const account = await Vault.getAccount(uid);
	if (parseInt(account.loan_sum, 10) > 0) throw new Error('You already have an outstanding loan');

	amount = parseInt(amount, 10);
	const maxLoan = parseInt(config.loan_max_sum, 10) || 5000;
	if (amount > maxLoan) throw new Error(`Maximum loan amount is ${maxLoan}`);
	if (amount <= 0) throw new Error('Invalid amount');

	const now = Math.floor(Date.now() / 1000);
	await db.setObject('adr:vault:' + uid, {
		loan_sum:  amount,
		loan_time: now,
	});
	await Character.addGold(uid, amount);

	return amount;
};

Vault.repayLoan = async function (uid, amount) {
	await Vault.accrueInterest(uid);
	const account = await Vault.getAccount(uid);
	const owed    = parseInt(account.loan_sum, 10) || 0;
	if (owed <= 0) throw new Error('No outstanding loan');

	amount = Math.min(parseInt(amount, 10), owed);
	if (amount <= 0) throw new Error('Invalid amount');

	await Character.deductGold(uid, amount);
	const remaining = owed - amount;
	await db.setObjectField('adr:vault:' + uid, 'loan_sum', remaining);

	return remaining;
};

Vault.getAllStocks = async function () {
	const ids = await db.getSortedSetRange('adr:vault:stocks', 0, -1);
	if (!ids || !ids.length) return [];
	return (await db.getObjects(ids.map(id => 'adr:vault:stock:' + id))).filter(Boolean);
};

Vault.getStock = async function (stockId) {
	return await db.getObject('adr:vault:stock:' + stockId);
};

Vault.getUserStockHoldings = async function (uid) {
	const stockIds = await db.getSortedSetRange('adr:vault:stocks', 0, -1);
	const holdings = [];
	for (const stockId of stockIds) {
		const amount = await db.sortedSetScore('adr:vault:stock:' + stockId + ':holders', uid);
		if (amount && amount > 0) {
			const stock = await db.getObject('adr:vault:stock:' + stockId);
			if (stock) holdings.push({ ...stock, amount, totalValue: amount * parseInt(stock.stock_price, 10) });
		}
	}
	return holdings;
};

Vault.buyStock = async function (uid, stockId, amount) {
	const config = await helpers.getConfig();
	if (!parseInt(config.stock_use, 10)) throw new Error('Stock market is disabled');

	const stock = await Vault.getStock(stockId);
	if (!stock) throw new Error('Stock not found');

	amount      = parseInt(amount, 10);
	if (amount <= 0) throw new Error('Invalid amount');
	const cost  = amount * parseInt(stock.stock_price, 10);

	await Character.deductGold(uid, cost);

	const current = parseInt(await db.sortedSetScore('adr:vault:stock:' + stockId + ':holders', uid) || 0, 10);
	await db.sortedSetAdd('adr:vault:stock:' + stockId + ':holders', current + amount, uid);

	return { cost, amount };
};

Vault.sellStock = async function (uid, stockId, amount) {
	const stock = await Vault.getStock(stockId);
	if (!stock) throw new Error('Stock not found');

	amount       = parseInt(amount, 10);
	const current = parseInt(await db.sortedSetScore('adr:vault:stock:' + stockId + ':holders', uid) || 0, 10);
	if (current < amount) throw new Error('You do not own that many shares');

	const proceeds = amount * parseInt(stock.stock_price, 10);
	await Character.addGold(uid, proceeds);

	const remaining = current - amount;
	if (remaining <= 0) {
		await db.sortedSetRemove('adr:vault:stock:' + stockId + ':holders', uid);
	} else {
		await db.sortedSetAdd('adr:vault:stock:' + stockId + ':holders', remaining, uid);
	}

	return { proceeds, amount };
};

Vault.updateStockPrices = async function () {
	const config  = await helpers.getConfig();
	const minChg  = parseInt(config.stock_min_change, 10) || 0;
	const maxChg  = parseInt(config.stock_max_change, 10) || 10;
	const stocks  = await Vault.getAllStocks();

	for (const stock of stocks) {
		const change = helpers.rollDice(minChg, maxChg);
		const dir    = Math.random() < 0.5 ? -1 : 1;
		const prevPrice = parseInt(stock.stock_price, 10);
		const newPrice  = Math.max(1, prevPrice + dir * change);

		await db.setObject('adr:vault:stock:' + stock.stock_id, {
			stock_previous_price: prevPrice,
			stock_price:          newPrice,
			stock_best_price:  Math.max(parseInt(stock.stock_best_price, 10) || newPrice, newPrice),
			stock_worst_price: Math.min(parseInt(stock.stock_worst_price, 10) || newPrice, newPrice),
		});
		await db.sortedSetAdd('adr:vault:stocks', newPrice, stock.stock_id);
	}
};

Vault.addBlacklist = async function (uid) {
	await db.setAdd('adr:vault:blacklist', uid);
};

Vault.removeBlacklist = async function (uid) {
	await db.setRemove('adr:vault:blacklist', uid);
};
