<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = ({ session, props }) => {
    if (!session.userSession) {
      return {
        status: 302,
        redirect: "/signin",
      };
    }

    return props
  };
</script>

<slot />
