<script lang="ts">
	import Button from '@smui/button';
	import Card from '@smui/card';
	import Textfield from '@smui/textfield';

	let email = '';
	let password = '';
	function register() {
		console.info('register');
	}
</script>

<div class="registerContainer">
	<Card padded>
		<h1>Register</h1>

		<form on:submit|preventDefault={register}>
			<div class="form">
				<Textfield variant="outlined" bind:value={email} label="Email" type="email" required />
				<Textfield variant="outlined" bind:value={password} label="Password" type="password" required input$minlength={15} />
				<div>
					<Button type="submit" variant="raised">Register</Button>
				</div>
			</div>
		</form>
	</Card>
</div>

<style>
	.registerContainer {
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
