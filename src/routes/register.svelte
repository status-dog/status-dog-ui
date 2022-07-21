<script lang="ts">
	import { default as Button } from '@smui/button';
	function register() {
		console.info('register');
	}
</script>

<h1>Register</h1>

<form on:submit|preventDefault={register}>
	<Button type="submit" variant="raised">Register</Button>
</form>
