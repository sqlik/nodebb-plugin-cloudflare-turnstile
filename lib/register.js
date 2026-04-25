'use strict';

const winston = require.main.require('winston');

const settings = require('./settings');
const turnstile = require('./turnstile');

const TOKEN_FIELD = 'cf-turnstile-response';

exports.verifyRegister = async (data) => {
	if (!settings.shouldVerifyRegister()) return data;

	const req = data && data.req;
	const body = (req && req.body) || (data && data.userData) || {};
	const token = body[TOKEN_FIELD];
	const cfg = settings.get();

	const result = await turnstile.verify({
		token,
		secret: cfg.secretKey,
		remoteip: turnstile.clientIpFromReq(req),
	});

	if (!result.success) {
		winston.verbose(`[plugin/cloudflare-turnstile] register verify failed: ${result.errorCode}`);
		if (result.errorCode === 'missing-input-response') {
			throw new Error('[[cloudflare-turnstile:error.not-completed]]');
		}
		throw new Error('[[cloudflare-turnstile:error.failed]]');
	}

	return data;
};
