<script>
    import { invalidate } from '$app/navigation';
    import { enhance } from '$app/forms';
    import AvatarDisplay from '$lib/components/profile/AvatarDisplay.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    const MAX_FILE_SIZE = 3 * 1000 * 1000;

    const { supabase, profile } = data;

    let displayName = profile?.display_name || 'Unknown user';
    let profilePicture = profile?.profile_picture;

    /**
	 * @type {HTMLInputElement}
	 */
    let imageInput;

    let nameSaving = false;
    let nameSaved = false;
    let pictureSaving = false;
    let pictureSaved = false;

    function nameHandling({}) {
        nameSaved = false;
        //TODO : debounce
        return async ({ result }) => {
            if (result.type === 'success') {
                nameSaved = true;
            }
            invalidate('turbo:profile');
        };
    }

    function triggerImageSelection() {
        imageInput.click();
    }
    
    async function avatarHandling(event) {
        pictureSaving = true;
        pictureSaved = false;
        const input = event.target;
        const selectedFiles = input.files;
        if (!selectedFiles || selectedFiles.length == 0) {
            return;
        }
        const file = selectedFiles[0];
        if (file) {
            console.log('handling avatar...' + file.name);
            try {
                await handleAvatarFile(file);
                invalidate('turbo:profile');
                pictureSaved = true;
            } catch (error) {
                console.error(error);
            }
            pictureSaving = false;
        }
    }

    async function handleAvatarFile(file) {
        if (!profile) {
            throw new Error("Vous n'avez aucun profile en cours");
        }
        if (!file.type.startsWith('image/')) {
            throw new Error('Type de fichier invalide');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error("L'image est trop grosse");
        }

        const extensionIndex = file.name.lastIndexOf('.');
        const extension = file.name.substring(extensionIndex);
        const fileName = profile.user_id + '/avatar' + extension;

        let { data: storageData, error: storageError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });
        if (storageError) {
            throw new Error(storageError.message);
        }
        if (!storageData) {
            throw new Error("Impossible d'enregistrer l'image");
        }

        const avatar = supabase.storage.from('avatars').getPublicUrl(storageData.path);
        const url = avatar.data.publicUrl;

        let { data: profileData, error: profileError } = await supabase
            .from('profile')
            .update({ profile_picture: url })
            .eq('user_id', profile.user_id);

        if (profileError) {
            throw new Error(profileError.message);
        }
        profilePicture = url;
        pictureSaved = true;
    }
</script>

<div class="screen-center">
    <div class="profile-editor">
        <div class="avatar-editor">
            <AvatarDisplay imageUrl={profilePicture} />
            <button class="btn" on:click={triggerImageSelection}>Changer l'image</button>
            <br />
            <input
                bind:this={imageInput}
                type="file"
                id="avatar-input"
                name="avatar"
                accept="image/*"
                on:change={avatarHandling}
                style="visibility: hidden;"
            />
        </div>
        <div class="name-editor">
            <form class="form-name" action="?/updateName" method="POST" use:enhance={nameHandling}>
                <input type="hidden" name="profile-id" value={profile?.user_id} />
                <label for="display-name">Nom affiché</label>
                <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    bind:value={displayName}
                    on:keypress={() => (nameSaved = false)}
                />
                <button class="btn name-btn">Changer le nom</button>
            </form>
        </div>
    </div>
</div>

{#if nameSaved}
    Nom sauvegardé
{/if}

<style>
    .profile-editor {
        max-width: 38rem;
        margin-inline: auto;
        text-align: center;
    }
    .form-name {
        display: grid;
    }
    label[for='display-name'] {
        background-color: var(--turbo-darkgray);
        color: white;
        padding: 1rem;
        font-size: 1.125rem;
    }
    form > label {
        font-weight: bold;
    }

    #display-name {
        text-align: center;
        font-size: 1.375rem;
        padding: 1rem;
    }

    .btn {
        outline-color: transparent;
        border-radius: 0.5em;
    }

    .name-btn {
        background-color: var(--turbo-orange);
        color: white;
    }
</style>
