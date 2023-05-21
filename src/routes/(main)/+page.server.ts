import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals: { getSession } }) => {
    const redirectUrl = url.searchParams.get('redirect') ?? '/account';
	const session = await getSession();

	if (session) {
		throw redirect(303, redirectUrl);
	}

	return { url: url.origin, redirect: redirectUrl };
}) satisfies PageServerLoad;