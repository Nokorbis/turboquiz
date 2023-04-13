/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch, parent, depends }) {
    depends('turbo:profile');
    
    console.log('Loading profile...');
    let profile = null; 
    
    const { supabase, session } = await parent();
    if (session) {
        const { data, error } = await supabase
            .from('profile')
            .select("*")
            .eq('user_id', session.user.id);
        if (!error && data.length > 0) {
            profile = data[0];
        }
    }
  
    return { profile };
}