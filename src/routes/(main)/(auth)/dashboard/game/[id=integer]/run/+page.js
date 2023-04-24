/** @type {import('../$types').PageLoad} */
export async function load({url, params, parent} ) {
    const gameId = params.id;

    const {supabase} =  await parent();
    return {
        baseUrl: url.origin,
        streamed: {
            game$: supabase.from('game').select('*').eq('id', gameId)
        }
    };
};