/// <reference types="@sveltejs/kit" />

import type { UserSession } from "$lib/session/user-session";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  declare namespace App {
    interface Locals {
      userId?: number;
      sessionId?: string;
    }
    // interface Platform {}
    // interface Stuff {}
  }
}
