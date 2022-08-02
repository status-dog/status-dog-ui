<script lang="ts">
	import Button from '@smui/button';
	import Card from '@smui/card';
	import Textfield from '@smui/textfield';

	let email = '';

	async function signUp() {
		const response = await fetch('/signup/generate-registration-options', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		});
		console.info('sign up');
	}
</script>

<div class="signUpContainer">
	<Card padded>
		<h1>Sign Up</h1>

		<form on:submit|preventDefault={signUp}>
			<div class="form">
				<Textfield variant="outlined" bind:value={email} label="Email" type="email" required />
				<div>
					<Button type="submit" variant="raised">Sign up</Button>
				</div>
			</div>
		</form>
	</Card>
</div>

<style>
	.signUpContainer {
		margin-left: auto;
		margin-right: auto;
		width: 500px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
</style>
