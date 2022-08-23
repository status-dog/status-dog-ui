/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

//this is needed if something is imported
//declare global {
declare namespace App {
  interface Locals {
    userId?: number;
    sessionId?: string;
  }
  // interface Platform {}
  // interface Stuff {}
}
//}
