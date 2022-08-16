<script lang="ts">
  import { get } from "svelte/store";
  import { session } from "$app/stores";

  const { userSession } = get(session);
</script>

{#if userSession}
  <h1>Dashboard</h1>
  <p>Hello {userSession.email}</p>
{/if}
