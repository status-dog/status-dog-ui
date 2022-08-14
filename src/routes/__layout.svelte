<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = ({ session }) => {
    if (session.userSession) {
      return {
        status: 302,
        redirect: "/dashboard",
      };
    }

    return {};
  };
</script>

<slot />
