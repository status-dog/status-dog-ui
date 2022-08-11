<script lang="ts">
	import Button from '@smui/button';
	import Card from '@smui/card';
	import Textfield from '@smui/textfield';
	import { startRegistration } from '@simplewebauthn/browser';

	let email = '';
	let error: string | undefined = undefined;

	async function signUp() {
		error = undefined;
		const optionsResponse = await fetch('/signup/generate-registration-options', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		if (optionsResponse.status === 200) {
			try {
				const attResponse = await startRegistration(await optionsResponse.json());
				const verificationReponse = await fetch('/signup/verify-registration', {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(attResponse),
				});
				const verificationJSON = await verificationReponse.json();
				console.log(verificationJSON);
			} catch (e) {
				console.error(e);
				error = 'Failed to use authenticator';
			}
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
		width: 500px;
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
