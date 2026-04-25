'use strict';

const winston = require.main.require('winston');

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

exports.verify = async ({ token, secret, remoteip }) => {
	if (!secret) {
		return { success: false, errorCode: 'missing-input-secret' };
	}
	if (!token) {
		return { success: false, errorCode: 'missing-input-response' };
	}

	const body = new URLSearchParams();
	body.append('secret', secret);
	body.append('response', token);
	if (remoteip) body.append('remoteip', remoteip);

	let resp;
	try {
		resp = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			body,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});
	} catch (err) {
		winston.error('[plugin/cloudflare-turnstile] siteverify network error: ' + err.message);
		return { success: false, errorCode: 'network-error' };
	}

	if (!resp.ok) {
		winston.error(`[plugin/cloudflare-turnstile] siteverify HTTP ${resp.status}`);
		return { success: false, errorCode: 'siteverify-http-error' };
	}

	let json;
	try {
		json = await resp.json();
	} catch (err) {
		winston.error('[plugin/cloudflare-turnstile] siteverify invalid JSON: ' + err.message);
		return { success: false, errorCode: 'siteverify-bad-response' };
	}

	if (json && json.success) {
		return { success: true };
	}

	const codes = Array.isArray(json && json['error-codes']) ? json['error-codes'] : [];
	return {
		success: false,
		errorCode: codes[0] || 'unknown',
		errorCodes: codes,
	};
};

exports.clientIpFromReq = (req) => {
	if (!req) return undefined;
	const xff = (req.headers && req.headers['x-forwarded-for']) || '';
	if (xff) {
		return String(xff).split(',')[0].trim() || undefined;
	}
	return req.ip || (req.connection && req.connection.remoteAddress) || undefined;
};
