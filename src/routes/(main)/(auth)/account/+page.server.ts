import { fail } from "@sveltejs/kit";


export const actions = {

	updateName: async ({locals: {supabase}, request} ) => {
        const {displayName, profileId, themes, hasMicrophone, wantToPlay, cultureLevel } = await extractNewProfile(request);

        const session = await supabase.auth.getSession();
        if (!session) {
            return fail(401, {displayName});
        }
        
        const errors = checkUpdateErrors(profileId, displayName);

        if (errors.length > 0) {
            return fail(400, {displayName, errors});
        }

        const { data, error} = await supabase.from('profile')
            .update({ display_name: displayName, themes, has_microphone: hasMicrophone, wants_to_play: wantToPlay, culture_level: cultureLevel})
            .eq('user_id', profileId);

        return {displayName, success: true};
    }
	
};

async function extractNewProfile(request: Request) {
    const data = await request.formData();
    const nameData = String(data.get('display-name'));
    const displayName = nameData.trim();
    const profileData = String(data.get('profile-id'));
    const profileId = profileData.trim();
    const themesData = String(data.get('themes'));
    const themes = themesData.trim();
    const wantToPlayData = String(data.get('want-to-play'));
    const wantToPlay = ['true', 'on'].includes(wantToPlayData);
    const hasMicrophoneData = String(data.get('has-microphone'));
    const hasMicrophone = ['true', 'on'].includes(hasMicrophoneData);
    const cultureLevelData = String(data.get('culture-level'));
    const cultureLevel = Number.parseInt(cultureLevelData);

    return { displayName, profileId, themes, wantToPlay, hasMicrophone, cultureLevel};
}

function checkUpdateErrors(profileId: string, displayName: string) : string[] {
    const errors = [];
    if (!displayName) {
        errors.push('invalid-name');
    }

    if (!profileId) {
        errors.push('invalid-id');
    }
    return errors;
}