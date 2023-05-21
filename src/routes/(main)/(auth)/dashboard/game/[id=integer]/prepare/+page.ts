import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({url}) => {
    throw redirect(307, 'prepare/players');
}) satisfies PageLoad;