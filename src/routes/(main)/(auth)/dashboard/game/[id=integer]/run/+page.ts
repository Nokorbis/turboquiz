import type { PageLoad } from './$types';

export const load = (async ({url, params, parent}) => {
    const gameId = params.id;

    const {supabase} =  await parent();
    return {
        baseUrl: url.origin,
        streamed: {
            game$: supabase.from('game').select('*').eq('id', gameId).limit(1).single()
        }
    };
}) satisfies PageLoad;