'use strict';

const meta = require.main.require('./src/meta');

const DEFAULTS = {
	enabled: false,
	siteKey: '',
	secretKey: '',
	verifyOnRegister: true,
	verifyOnLogin: false,
	theme: 'auto',
	size: 'normal',
	appearance: 'always',
};

const VALID_THEMES = new Set(['auto', 'light', 'dark']);
const VALID_SIZES = new Set(['normal', 'flexible', 'compact']);
const VALID_APPEARANCES = new Set(['always', 'execute', 'interaction-only']);

let cache = { ...DEFAULTS };

function toBool(v, fallback) {
	if (v === true || v === 'true' || v === 'on' || v === 1 || v === '1') return true;
	if (v === false || v === 'false' || v === 'off' || v === 0 || v === '0') return false;
	return fallback;
}

exports.load = async () => {
	const stored = await meta.settings.get('cloudflare-turnstile') || {};
	cache = { ...DEFAULTS, ...stored };
	cache.enabled = toBool(cache.enabled, DEFAULTS.enabled);
	cache.verifyOnRegister = toBool(cache.verifyOnRegister, DEFAULTS.verifyOnRegister);
	cache.verifyOnLogin = toBool(cache.verifyOnLogin, DEFAULTS.verifyOnLogin);
	cache.siteKey = String(cache.siteKey || '').trim();
	cache.secretKey = String(cache.secretKey || '').trim();
	if (!VALID_THEMES.has(cache.theme)) cache.theme = DEFAULTS.theme;
	if (!VALID_SIZES.has(cache.size)) cache.size = DEFAULTS.size;
	if (!VALID_APPEARANCES.has(cache.appearance)) cache.appearance = DEFAULTS.appearance;
	return cache;
};

exports.get = () => cache;

exports.isConfigured = () => !!(cache.enabled && cache.siteKey && cache.secretKey);

exports.shouldVerifyRegister = () => exports.isConfigured() && cache.verifyOnRegister;
exports.shouldVerifyLogin = () => exports.isConfigured() && cache.verifyOnLogin;

exports.DEFAULTS = DEFAULTS;
