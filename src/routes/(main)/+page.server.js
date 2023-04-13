import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, locals: { getSession } }) {
    let redirectUrl = url.searchParams.get('redirect') ?? '/account';
	const session = await getSession();

	if (session) {
		throw redirect(303, redirectUrl);
	}

	return { url: url.origin, redirect: redirectUrl };
};