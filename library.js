'use strict';

const winston = require.main.require('winston');

const settings = require('./lib/settings');
const register = require('./lib/register');
const login = require('./lib/login');
const admin = require('./lib/admin');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware } = params;

	router.get('/admin/plugins/cloudflare-turnstile', middleware.admin.buildHeader, admin.renderAdminPage);
	router.get('/api/admin/plugins/cloudflare-turnstile', admin.renderAdminPage);

	await settings.load();

	const sockets = require.main.require('./src/socket.io/plugins');
	sockets['cloudflare-turnstile'] = sockets['cloudflare-turnstile'] || {};
	sockets['cloudflare-turnstile'].reload = async (socket) => {
		const user = require.main.require('./src/user');
		const isAdmin = await user.isAdministrator(socket.uid);
		if (!isAdmin) throw new Error('[[error:no-privileges]]');
		await settings.load();
		return { ok: true };
	};

	winston.verbose('[plugin/cloudflare-turnstile] initialised (configured=' + settings.isConfigured() + ')');
};

plugin.addAdminMenu = async (header) => {
	header.plugins.push({
		route: '/plugins/cloudflare-turnstile',
		icon: 'fa-shield',
		name: 'Cloudflare Turnstile',
	});
	return header;
};

plugin.exposeClientConfig = async (config) => {
	const s = settings.get();
	if (!settings.isConfigured()) {
		config.cloudflareTurnstile = { enabled: false };
		return config;
	}
	config.cloudflareTurnstile = {
		enabled: true,
		siteKey: s.siteKey,
		theme: s.theme,
		size: s.size,
		appearance: s.appearance,
		onRegister: !!s.verifyOnRegister,
		onLogin: !!s.verifyOnLogin,
	};
	return config;
};

plugin.verifyRegister = register.verifyRegister;
plugin.verifyLogin = login.verifyLogin;

module.exports = plugin;
