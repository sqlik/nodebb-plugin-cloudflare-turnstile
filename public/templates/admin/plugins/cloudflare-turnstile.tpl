<div class="acp-page-container">
	<div class="row">
		<div class="col-lg-9">
			<div class="acp-page-main-header align-items-center">
				<div>
					<h2 class="mb-0">[[cloudflare-turnstile:title]]</h2>
					<small class="text-muted">[[cloudflare-turnstile:subtitle]]</small>
				</div>
			</div>

			<form role="form" class="cloudflare-turnstile-settings">
				<div class="card mb-3">
					<div class="card-header">[[cloudflare-turnstile:section.activation]]</div>
					<div class="card-body">
						<div class="mb-3 form-check form-switch">
							<input type="checkbox" class="form-check-input" id="enabled" name="enabled" />
							<label class="form-check-label" for="enabled">[[cloudflare-turnstile:field.enabled]]</label>
							<div class="form-text text-muted">[[cloudflare-turnstile:field.enabled.help]]</div>
						</div>
					</div>
				</div>

				<div class="card mb-3">
					<div class="card-header">[[cloudflare-turnstile:section.keys]]</div>
					<div class="card-body">
						<div class="alert alert-info">
							[[cloudflare-turnstile:keys.notice]]
						</div>
						<div class="mb-3">
							<label class="form-label" for="siteKey">[[cloudflare-turnstile:field.siteKey]]</label>
							<input type="text" class="form-control" id="siteKey" name="siteKey" autocomplete="off" />
							<small class="form-text text-muted">[[cloudflare-turnstile:field.siteKey.help]]</small>
						</div>
						<div class="mb-3">
							<label class="form-label" for="secretKey">[[cloudflare-turnstile:field.secretKey]]</label>
							<input type="password" class="form-control" id="secretKey" name="secretKey" autocomplete="off" />
							<small class="form-text text-muted">[[cloudflare-turnstile:field.secretKey.help]]</small>
						</div>
					</div>
				</div>

				<div class="card mb-3">
					<div class="card-header">[[cloudflare-turnstile:section.behaviour]]</div>
					<div class="card-body">
						<div class="mb-3 form-check form-switch">
							<input type="checkbox" class="form-check-input" id="verifyOnRegister" name="verifyOnRegister" />
							<label class="form-check-label" for="verifyOnRegister">[[cloudflare-turnstile:field.verifyOnRegister]]</label>
						</div>
						<div class="mb-3 form-check form-switch">
							<input type="checkbox" class="form-check-input" id="verifyOnLogin" name="verifyOnLogin" />
							<label class="form-check-label" for="verifyOnLogin">[[cloudflare-turnstile:field.verifyOnLogin]]</label>
							<div class="form-text text-muted">[[cloudflare-turnstile:field.verifyOnLogin.help]]</div>
						</div>
					</div>
				</div>

				<div class="card mb-3">
					<div class="card-header">[[cloudflare-turnstile:section.appearance]]</div>
					<div class="card-body">
						<div class="mb-3">
							<label class="form-label" for="theme">[[cloudflare-turnstile:field.theme]]</label>
							<select class="form-select" id="theme" name="theme">
								<option value="auto">[[cloudflare-turnstile:theme.auto]]</option>
								<option value="light">[[cloudflare-turnstile:theme.light]]</option>
								<option value="dark">[[cloudflare-turnstile:theme.dark]]</option>
							</select>
						</div>
						<div class="mb-3">
							<label class="form-label" for="size">[[cloudflare-turnstile:field.size]]</label>
							<select class="form-select" id="size" name="size">
								<option value="normal">[[cloudflare-turnstile:size.normal]]</option>
								<option value="flexible">[[cloudflare-turnstile:size.flexible]]</option>
								<option value="compact">[[cloudflare-turnstile:size.compact]]</option>
							</select>
						</div>
						<div class="mb-3">
							<label class="form-label" for="appearance">[[cloudflare-turnstile:field.appearance]]</label>
							<select class="form-select" id="appearance" name="appearance">
								<option value="always">[[cloudflare-turnstile:appearance.always]]</option>
								<option value="execute">[[cloudflare-turnstile:appearance.execute]]</option>
								<option value="interaction-only">[[cloudflare-turnstile:appearance.interaction-only]]</option>
							</select>
							<small class="form-text text-muted">[[cloudflare-turnstile:field.appearance.help]]</small>
						</div>
					</div>
				</div>
			</form>
		</div>

		<div class="col-lg-3 acp-sidebar">
			<div class="card">
				<div class="card-body">
					<button id="save" class="btn btn-primary w-100">[[cloudflare-turnstile:save]]</button>
					<hr>
					<p class="small text-muted mb-2">[[cloudflare-turnstile:status.label]]</p>
					<p class="small mb-1">
						{{{ if configured }}}
						<span class="badge bg-success">[[cloudflare-turnstile:status.configured]]</span>
						{{{ else }}}
						<span class="badge bg-warning">[[cloudflare-turnstile:status.not-configured]]</span>
						{{{ end }}}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
