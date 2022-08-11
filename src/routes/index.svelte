<script>
	import { goto } from '$app/navigation';

	import Button from '@smui/button/src/Button.svelte';
	import Card from '@smui/card';

	function signUp() {
		goto('/signup');
	}
	function signIn() {
		goto('/signin');
	}
</script>

<div class="signUpContainer">
	<Card padded>
		<h1 class="header">Welcome to Status dog</h1>
		<div class="actions-wrapper">
			<div class="actions">
				<Button on:click={signIn} variant="raised">Sign in</Button>
				<Button on:click={signUp} variant="outlined">Sign up</Button>
			</div>
		</div>
	</Card>
</div>

<style>
	.header {
		white-space: pre-wrap;
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
		text-align: center;
	}

	.actions-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.actions {
		width: 200px;
	}
</style>
