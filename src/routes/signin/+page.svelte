<script lang="ts">
  import type { AuthenticationOptionsParams } from "$lib/signup/model";

  import Button from "@smui/button";
  import Card from "@smui/card";
  import Textfield from "@smui/textfield";
  import { startAuthentication } from "@simplewebauthn/browser";
  import type {
    AuthenticationCredentialJSON,
    PublicKeyCredentialRequestOptionsJSON,
  } from "@simplewebauthn/typescript-types";
  import { goto } from "$app/navigation";

  let error: string | undefined = undefined;

  let email = "";

  async function login() {
    error = undefined;
    const optionsRequestBody: AuthenticationOptionsParams = { email };
    const optionsResponse = await fetch("/signin/generate-authentication-options", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(optionsRequestBody),
    });
    if (optionsResponse.status === 200) {
      try {
        const options: PublicKeyCredentialRequestOptionsJSON = await optionsResponse.json();
        const attResponse: AuthenticationCredentialJSON = await startAuthentication(options);
        const verificationReponse = await fetch("/signin/verify-authentication", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attResponse),
        });
        if (verificationReponse.status === 200) {
          await verificationReponse.json();
          goto("/dashboard");
        }
      } catch (e) {
        console.error(e);
        error = "Failed to authenticate.";
      }
    } else {
      error = "Failed to generate authentication challenge";
    }
  }
</script>

<div class="loginContainer">
  <Card padded>
    <h2>Sign In</h2>

    <div class="content">
      <form on:submit|preventDefault={login}>
        <div class="form">
          <Textfield variant="outlined" bind:value={email} label="Email" type="email" required />
          <div>
            <Button type="submit" variant="raised">Sign in</Button>
          </div>
        </div>
      </form>
      {#if error !== undefined}
        <div class="error">
          {error}
        </div>
      {/if}
      <div>
        Don't have an account? <a href="/signup">Sign up</a> instead.
      </div>
    </div>
  </Card>
</div>

<style>
  .error {
    color: var(--error-text-color);
  }
  .loginContainer {
    margin-left: auto;
    margin-right: auto;
    max-width: 500px;
    width: 90%;
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

  .content {
    display: flex;
    gap: 8px;
    flex-direction: column;
  }
</style>
