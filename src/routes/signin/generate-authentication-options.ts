import { getAuthenticators } from '$lib/db/authenticator-repo';
import { getUser, persistUserChallenge } from '$lib/db/user-repo';
import type { AuthenticationOptionsParams } from '$lib/signup/model';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler<
	Record<string, string>,
	PublicKeyCredentialRequestOptionsJSON | string
> = async ({ request }) => {
	const params: AuthenticationOptionsParams = await request.json();
	console.info('Generating authentication options');

	const user = await getUser(params.email);

	if (user) {
		const authenticators = await getAuthenticators(user.id);
		const options = generateAuthenticationOptions({
			allowCredentials: authenticators.map((authenticator) => ({
				id: authenticator.credentialID,
				type: 'public-key',
				transports: authenticator.transports || undefined,
			})),
			userVerification: 'preferred',
		});

		await persistUserChallenge(user.id, options.challenge);

		console.info(user, authenticators);
		return { status: 200, body: options };
	} else {
		return { status: 400 };
	}
};
