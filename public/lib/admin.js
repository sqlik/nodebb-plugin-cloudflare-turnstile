'use strict';

/* globals $, socket */

import { save, load } from 'settings';
import * as alerts from 'alerts';

export function init() {
	const $form = $('.cloudflare-turnstile-settings');
	load('cloudflare-turnstile', $form);

	$('#save').on('click', () => {
		save('cloudflare-turnstile', $form, () => {
			socket.emit('plugins.cloudflare-turnstile.reload', {}, (err) => {
				if (err) {
					alerts.error(err);
					return;
				}
				alerts.alert({
					type: 'success',
					title: '[[cloudflare-turnstile:saved.title]]',
					message: '[[cloudflare-turnstile:saved.message]]',
					timeout: 2500,
				});
			});
		});
	});
}
