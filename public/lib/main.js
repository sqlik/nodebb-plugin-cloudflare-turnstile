'use strict';

/* globals $, ajaxify, config */

(function () {
	const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
	const WIDGET_DIV_ID = 'cf-turnstile-widget-mount';

	let scriptPromise = null;
	let currentWidget = null;

	function loadScript() {
		if (window.turnstile) return Promise.resolve();
		if (scriptPromise) return scriptPromise;
		scriptPromise = new Promise((resolve, reject) => {
			const s = document.createElement('script');
			s.src = SCRIPT_URL;
			s.async = true;
			s.defer = true;
			s.onload = () => resolve();
			s.onerror = () => {
				scriptPromise = null;
				reject(new Error('Turnstile script load failed'));
			};
			document.head.appendChild(s);
		});
		return scriptPromise;
	}

	function findForm(template) {
		if (template.register) {
			return document.querySelector('#content form#register, #content form[action*="/register"]');
		}
		if (template.login) {
			return document.querySelector('#content form#login-form, #content form[action*="/login"]');
		}
		return null;
	}

	function removeExistingWidget() {
		if (currentWidget && window.turnstile) {
			try { window.turnstile.remove(currentWidget); } catch (_) { /* noop */ }
		}
		currentWidget = null;
		const existing = document.getElementById(WIDGET_DIV_ID);
		if (existing) existing.remove();
	}

	function mountWidget(form, cfg) {
		removeExistingWidget();

		const div = document.createElement('div');
		div.id = WIDGET_DIV_ID;
		div.className = 'mb-3';

		const submit = form.querySelector('button[type="submit"], input[type="submit"]');
		if (submit && submit.parentNode) {
			submit.parentNode.insertBefore(div, submit);
		} else {
			form.appendChild(div);
		}

		try {
			currentWidget = window.turnstile.render('#' + WIDGET_DIV_ID, {
				sitekey: cfg.siteKey,
				theme: cfg.theme || 'auto',
				size: cfg.size || 'normal',
				appearance: cfg.appearance || 'always',
			});
		} catch (err) {
			console.error('[cloudflare-turnstile] render failed:', err); // eslint-disable-line no-console
		}
	}

	function tryRender() {
		const cfg = (typeof config !== 'undefined' && config && config.cloudflareTurnstile) || null;
		if (!cfg || !cfg.enabled) {
			removeExistingWidget();
			return;
		}

		const template = (window.ajaxify && ajaxify.data && ajaxify.data.template) || {};
		const onPage = (template.register && cfg.onRegister) || (template.login && cfg.onLogin);
		if (!onPage) {
			removeExistingWidget();
			return;
		}

		const form = findForm(template);
		if (!form) return;

		loadScript().then(() => {
			if (!window.turnstile) {
				setTimeout(tryRender, 80);
				return;
			}
			mountWidget(form, cfg);
		}).catch((err) => {
			console.error('[cloudflare-turnstile] script load error:', err); // eslint-disable-line no-console
		});
	}

	$(window).on('action:ajaxify.end', tryRender);
	$(document).ready(tryRender);
}());
