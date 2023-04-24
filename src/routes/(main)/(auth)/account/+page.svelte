<script>
    import { invalidate } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { RangeSlider, toastStore } from '@skeletonlabs/skeleton';
    import AvatarDisplay from '$lib/components/profile/AvatarDisplay.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    const MAX_FILE_SIZE = 3 * 1000 * 1000;
    const cultureLevels = [
        'Je s\'appelle chaise',
        '2/5',
        '3/5',
        '4/5',
        'Top 50 Maître des fleurs'
    ]

    const { supabase, profile } = data;

    let displayName = profile?.display_name || 'Unknown user';
    let profilePicture = profile?.profile_picture;
    let themes = profile?.themes ?? '';
    let hasMicrophone = profile?.has_microphone ?? false;
    let wantToPlay = profile?.wants_to_play ?? false;
    let cultureLevel = profile?.culture_level ?? 3;

    /**
	 * @type {HTMLInputElement}
	 */
    let imageInput;

    let profileSaving = false;
    let pictureSaving = false;
    let pictureSaved = false;

    function nameHandling({}) {
        //TODO : debounce
        profileSaving = true;
        return async ({ result }) => {
            if (result.type === 'success') {
                toastStore.trigger({ message : 'Profile sauvegardé', background: 'variant-filled-success'});
            }
            profileSaving = false;
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
                <div>
                    <label class="label text-left" for="display-name">Nom affiché</label>
                    <input
                        class="input bg-white text-center"
                        id="display-name"
                        name="display-name"
                        type="text"
                        bind:value={displayName}
                    />
                </div>
                <div class="mt-2">
                    <label for="themes" class="label text-left">Idées de thèmes</label>
                    <input
                        class="input bg-white text-center"
                        id="themes"
                        name="themes"
                        type="text"
                        bind:value={themes}>
                </div>
                <div class="mt-2">
                    <RangeSlider name="culture-level" bind:value={cultureLevel} max={5} min={1} step={1} label="Niveau de culture estimé">
                        <div class="flex justify-between items-center">
                            <span class="">Niveau de culture estimé</span>
                            <span>{cultureLevels[cultureLevel-1]}</span>
                        </div>
                    </RangeSlider>
                </div>
                <div class="flex mt-2 gap-2">
                    <input type="checkbox" 
                        name="has-microphone" 
                        id="has-microphone"
                        class="checkbox"
                        bind:checked={hasMicrophone}>
                    <label for="has-microphone">J'ai un micro</label>
                </div>
                <div class="flex mt-2 gap-2">
                    <input type="checkbox" 
                        name="want-to-play" 
                        id="want-to-play"
                        class="checkbox"
                        bind:checked={wantToPlay}>
                    <label for="want-to-play">Je veux jouer prochainement</label>
                </div>
                <button class="btn bg-secondary-500 text-white mt-2" disabled={profileSaving}>Mettre à jour</button>
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

</style>
