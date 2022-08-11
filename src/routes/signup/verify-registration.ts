import { getChallenge } from '$lib/db/pending-registrations-repo';
import type { RegistrationVerificationBody } from '$lib/signup/model';
import { rpID, statusDogOrigin } from '$lib/webauthn/models';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler<Record<string, string>, string> = async ({ request }) => {
	const params: RegistrationVerificationBody = await request.json();
	console.info('Verify registration');

	const challenge = await getChallenge(parseInt(params.user.id));
	try {
		const verification = await verifyRegistrationResponse({
			credential: params.attResponse,
			expectedChallenge: challenge,
			expectedOrigin: statusDogOrigin,
			expectedRPID: rpID,
		});

		if (verification.verified) {
			//TODO store authenticator and user
			return { status: 200, body: '{}' };
		} else {
			return { status: 400, body: 'Failed' };
		}
	} catch (error) {
		console.error(error);
		return { status: 400, body: 'Failed' };
	}
};
