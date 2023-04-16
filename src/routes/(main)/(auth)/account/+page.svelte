<script>
    import { invalidate } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { toastStore } from '@skeletonlabs/skeleton';
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
    let pictureSaving = false;
    let pictureSaved = false;

    function nameHandling({}) {
        //TODO : debounce
        return async ({ result }) => {
            if (result.type === 'success') {
                toastStore.trigger({ message : 'Nom sauvegardé', background: 'variant-filled-success'});
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
        <div class="my-2 card variant-glass-primary p-2">
            <!-- <Avatar src={profilePicture} rounded="rounded-full" width="w-64 mx-auto" border="border-[1rem] border-orange-500"></Avatar> -->
            <AvatarDisplay imageUrl={profilePicture} />
            <div class="text-center mt-3">
                <button class="btn bg-secondary-500 text-white" on:click={triggerImageSelection}>Changer l'image</button>
            </div>
            <input
                bind:this={imageInput}
                type="file"
                id="avatar-input"
                name="avatar"
                accept="image/*"
                on:change={avatarHandling}
                style="display: none;"
            />
        </div>
        <div class="card p-4 variant-glass-primary">
            <form class="form-name" action="?/updateName" method="POST" use:enhance={nameHandling}>
                <input type="hidden" name="profile-id" value={profile?.user_id} />
                <label class="label text-left" for="display-name">Nom affiché</label>
                <input
                    class="input bg-white"
                    id="display-name"
                    name="display-name"
                    type="text"
                    bind:value={displayName}
                />
                <button class="btn bg-secondary-500 text-white mt-2">Changer le nom</button>
            </form>
        </div>
    </div>
</div>

<style>
    .profile-editor {
        max-width: 38rem;
        margin-inline: auto;
        text-align: center;
    }

    #display-name {
        text-align: center;
    }

</style>
