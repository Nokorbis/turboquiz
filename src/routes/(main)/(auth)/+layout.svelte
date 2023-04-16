<script>
    import { goto } from '$app/navigation';
    import { AppBar} from '@skeletonlabs/skeleton';


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
<div class="flex flex-col bg-surface-100-800-token p-4">
    {#if profile}
    <nav class="profile-nav">
        <ul>
            {#if isAnimator()}<li><a href="/dashboard" class="btn p-1">Dashboard</a></li>{/if}
            <li>
                <a href="/account" class="btn p-1">
                    <img src={profile.profile_picture} alt="Avatar" />
                    <span>{profile.display_name}</span>
                </a>
            </li>
            <li><a href="#" on:click|preventDefault={logout} class="btn p-1">Se déconnecter</a></li>
        </ul>
    </nav>
    {/if}
</div>  

<slot />

<style>
    nav {
        box-sizing: border-box;
    }
    ul {
        display: flex;
        gap: 1rem;
        justify-content: end;
        margin-right: 1rem;
    }

    li {
        list-style: none;
    }

    a img {
        width: 24px;
        height: 24px;
        aspect-ratio: 1;
    }

  
</style>
