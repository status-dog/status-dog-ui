<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = ({ session }) => {
    if (!session.userSession) {
      return {
        status: 302,
        redirect: "/signin",
      };
    }

    return {};
  };
</script>

<script lang="ts">
  import type { TopAppBarComponentDev } from "@smui/top-app-bar";
  import TopAppBar, { Row, Section, Title, AutoAdjust } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";

  let topAppBar: TopAppBarComponentDev;
</script>

<TopAppBar bind:this={topAppBar} variant="fixed">
  <Row>
    <Section>
      <!--<IconButton class="material-icons">menu</IconButton> -->
      <Title>Status Dog</Title>
    </Section>
    <Section align="end" toolbar>
      <IconButton href="/signout" class="material-icons" aria-label="Bookmark this page"
        >logout</IconButton
      >
    </Section>
  </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
  <slot />
</AutoAdjust>
