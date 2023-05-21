import type { LayoutLoad } from './$types';

export const load = (async ({url, params}) => {
    const gameId = Number.parseInt(params.id);

    return {
        baseUrl: url.origin,
        gameId
    };
}) satisfies LayoutLoad;