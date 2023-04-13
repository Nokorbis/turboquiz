<script>
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;

    $: {
        const redirectTo = $page.url.searchParams.get('redirect');

        // check if user has been set in session store then redirect
        if (browser && data.session) {
            goto(redirectTo ?? '/account');
        }
    }
</script>

<section>Redirection vers une page appropriée en cours</section>
