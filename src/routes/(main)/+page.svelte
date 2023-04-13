<script>
    import { ThemeSupa } from '@supabase/auth-ui-shared';
    import { Auth } from '@supabase/auth-ui-svelte';
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div>
    <Auth
        supabaseClient={data.supabase}
        providers={['twitch', 'discord']}
        redirectTo={`${data.url}/logging-in?redirect=${data.redirect}`}
        showLinks={false}
        appearance={{ theme: ThemeSupa }}
        onlyThirdPartyProviders={true}
        localization={{
            variables: {
                sign_in: {
                    social_provider_text: 'Se connecter avec {{provider}}',
                },
            },
        }}
    />
</div>

<style>
    div {
        margin-inline: auto;
        max-width: 768px;
    }
</style>