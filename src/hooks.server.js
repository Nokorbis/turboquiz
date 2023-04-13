import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  } from '$env/static/public';
  import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
  
  export const handle = async ({ event, resolve }) => {
    const supabase = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event
    });
    event.locals.supabase = supabase;
  
    /**
     * a little helper that is written for convenience so that instead
     * of calling `const { data: { session } } = await supabase.auth.getSession()`
     * you just call this `await getSession()`
     */
    event.locals.getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      return session;
    };
  
    return resolve(event, {
      /**
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === 'content-range';
      }
    });
  };