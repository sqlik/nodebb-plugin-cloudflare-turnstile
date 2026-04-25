'use strict';

const settings = require('./settings');

exports.renderAdminPage = (req, res) => {
	const s = settings.get();
	res.render('admin/plugins/cloudflare-turnstile', {
		title: 'Cloudflare Turnstile',
		enabled: s.enabled,
		siteKey: s.siteKey,
		secretKey: s.secretKey,
		verifyOnRegister: s.verifyOnRegister,
		verifyOnLogin: s.verifyOnLogin,
		theme: s.theme,
		size: s.size,
		appearance: s.appearance,
		configured: settings.isConfigured(),
	});
};
