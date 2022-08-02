import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	console.info('Generating registration options');
	return { status: 200, body: 'ok' };
};
