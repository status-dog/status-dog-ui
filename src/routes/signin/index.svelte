<script lang="ts">
	import Button from '@smui/button';
	import Card from '@smui/card';
	import Textfield from '@smui/textfield';

	let email = '';
	function login() {
		console.info('login');
	}
</script>

<div class="loginContainer">
	<Card padded>
		<h1>Sign In</h1>

		<form on:submit|preventDefault={login}>
			<div class="form">
				<Textfield variant="outlined" bind:value={email} label="Email" type="email" required />
				<div>
					<Button type="submit" variant="raised">Login</Button>
				</div>
			</div>
		</form>
	</Card>
</div>

<style>
	.loginContainer {
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
