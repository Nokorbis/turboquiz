import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({parent, depends}) => {
    depends('turbo:profile');
    
    console.log('Loading profile...');
    let profile = null; 
    
    const { supabase, session } = await parent();
    if (session) {
        const { data, error } = await supabase
            .from('profile')
            .select("*")
            .eq('user_id', session.user.id)
            .limit(1).single();
        if (!error && data) {
            profile = data;
        }
    }

    if (!profile) {
        throw redirect(307, '/');
    }
  
    return { profile };
}) satisfies LayoutLoad;