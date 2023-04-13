import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ url, parent }) {
    const {supabase, session} = await parent();

    // if the user is not logged in return them to the login page
	if (!session) {
		if (browser) {
			goto('/?redirect=/dashboard');
			return;
		}
		else {
			throw redirect(303, '/?redirect=/dashboard');
		}
	}

	const user = session.user;
	const isAnimator = user?.app_metadata?.is_animator ?? false;

	if (!isAnimator) {
		if (browser) {
			goto('/account');
			return;
		}
		else {
			throw redirect(303, '/account');
		}
	}

	return { url: url.origin };
};