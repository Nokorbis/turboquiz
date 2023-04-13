import { fail } from "@sveltejs/kit";

export const actions = {

	updateName: async ({locals: {supabase}, request} ) => {
        const {displayName, profileId } = await extractIdAndName(request);

        const session = await supabase.auth.getSession();
        if (!session) {
            return fail(401, {displayName});
        }
        
        const errors = checkUpdateErrors( profileId, displayName);

        if (errors.length > 0) {
            return fail(400, {displayName, errors});
        }

        const { data, error} = await supabase.from('profile')
            .update({ display_name: displayName})
            .eq('user_id', profileId);

        return {displayName, success: true};
    }
	
};

/**
 * @param {{ formData: () => any; }} request
 */
async function extractIdAndName(request) {
    const data = await request.formData();
    const nameData = data.get('display-name');
    const displayName = nameData.trim();
    const profileData = data.get('profile-id');
    const profileId = profileData.trim();

    return { displayName, profileId};
}

/**
 * @param {string} profileId
 * @param {string} displayName
 */
function checkUpdateErrors(profileId, displayName) {
    const errors = [];
    if (!displayName) {
        errors.push('invalid-name');
    }

    if (!profileId) {
        errors.push('invalid-id');
    }
    return errors;
}