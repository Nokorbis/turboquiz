<script lang="ts">
    import type { LayoutData } from './$types';
    import { goto } from '$app/navigation';
    import { AppShell} from '@skeletonlabs/skeleton';
    
    export let data: LayoutData;

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

<AppShell slotPageContent="h-full">
    <svelte:fragment slot="header">
		<div class="flex flex-col bg-surface-100-800-token p-4">
            {#if profile}
            <nav class="profile-nav">
                <ul class="">
                    {#if isAnimator()}<li><a href="/dashboard" class="btn p-1 ">Dashboard</a></li>{/if}
                    <li>
                        <a href="/account" class="btn p-1">
                            <img src={profile.profile_picture} alt="Avatar" />
                            <span class="">{profile.display_name}</span>
                        </a>
                    </li>
                    <li><a href="#" on:click|preventDefault={logout} class="btn p-1">Se déconnecter</a></li>
                </ul>
            </nav>
            {/if}
        </div>  
	</svelte:fragment>
    <slot />
</AppShell>

<style>
    nav {
        box-sizing: border-box;
    }
    ul {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-right: 1rem;
    }

    li {
        list-style: none;
    }

    @media (max-width: 400px) {
        ul > li > a{
            font-size: 0.75rem;
        }
    }

    
    a img {
        width: 24px;
        height: 24px;
        aspect-ratio: 1;
    }
</style>