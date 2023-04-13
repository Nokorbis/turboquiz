<script>
    import { goto } from '$app/navigation';

    /** @type {import('./$types').LayoutData} */
    export let data;

    $: ({ supabase, session, profile } = data);

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
        } else {
            goto('/');
        }
    }

    function isAnimator() {
        const user = session?.user;
        const isAnimator = user?.app_metadata?.is_animator ?? false;
        return isAnimator;
    }
</script>
{#if profile}
    <nav>
        <ul>
            {#if isAnimator()}<li><a href="/dashboard">Dashboard</a></li>{/if}
            <li>
                <a href="/account">
                    <img src={profile.profile_picture} alt="Avatar" width="16px" height="16px" />
                    <span>{profile.display_name}</span>
                </a>
            </li>
            <li><a href="#" on:click|preventDefault={logout}>Se déconnecter</a></li>
        </ul>
    </nav>
{/if}

<slot />

<style>
    nav {
        box-sizing: border-box;
        border: 2px solid green;
        height: var(--turbo-bar-size);
    }
    ul {
        display: flex;
        gap: 1rem;
        justify-content: end;
        margin-right: 1rem;
    }

    li {
        list-style: none;
        border: 1px solid red;
    }
</style>
