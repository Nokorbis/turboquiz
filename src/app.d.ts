// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		supabase: SupabaseClient;
		getSession(): Promise<Session | null>;
	  }
	  interface PageData {
		session: Session | null;
	  }
	  // interface Error {}
	  // interface Platform {}
}

declare module '@fortawesome/fontawesome-free/index.es' {
	export * from '@fortawesome/fontawesome-free';
  }
