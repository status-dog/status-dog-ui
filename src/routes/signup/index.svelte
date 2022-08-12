<script lang="ts">
	import Button from '@smui/button';
	import Card from '@smui/card';
	import Textfield from '@smui/textfield';
	import { startRegistration } from '@simplewebauthn/browser';
	import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
	import type { CreationOptionsParams } from '$lib/signup/model';
	import { goto } from '$app/navigation';

	let email = '';
	let error: string | undefined = undefined;

	async function signUp() {
		error = undefined;
		const optionsRequestBody: CreationOptionsParams = { email };
		const optionsResponse = await fetch('/signup/generate-registration-options', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(optionsRequestBody),
		});

		if (optionsResponse.status === 200) {
			try {
				const options: PublicKeyCredentialCreationOptionsJSON = await optionsResponse.json();
				console.info(options.user);
				const attResponse = await startRegistration(options);
				const requestBody = {
					user: options.user,
					attResponse,
				};
				const verificationReponse = await fetch('/signup/verify-registration', {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody),
				});
				if (verificationReponse.status === 200) {
					goto('/signin');
				} else {
					error = 'Verification failed.';
				}
			} catch (e) {
				console.error(e);
				error = 'Failed to use authenticator';
			}
		} else if (optionsResponse.status === 409) {
			error = 'User with that email already exists.';
		} else {
			error = 'Failed to generate registration options';
		}
	}
</script>

<div class="signUpContainer">
	<Card padded>
		<h1>Sign Up</h1>

		<div class="content">
			<form on:submit|preventDefault={signUp}>
				<div class="form">
					<Textfield variant="outlined" bind:value={email} label="Email" type="email" required />
					<div>
						<Button type="submit" variant="raised">Sign up</Button>
					</div>
				</div>
			</form>
			{#if error !== undefined}
				<div class="error">
					{error}
				</div>
			{/if}
		</div>
	</Card>
</div>

<style>
	.error {
		color: var(--error-text-color);
	}
	.signUpContainer {
		margin-left: auto;
		margin-right: auto;
		max-width: 500px;
		width: 90%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.content {
		display: flex;
		gap: 8px;
		flex-direction: column;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
</style>
