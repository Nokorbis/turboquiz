<script>
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';

    /** @type {import('./$types').LayoutData} */
    export let data;

    $: ({ supabase, session } = data);

    onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<svelte:head>
    <title>TurboQuiz</title>
</svelte:head>

<slot />