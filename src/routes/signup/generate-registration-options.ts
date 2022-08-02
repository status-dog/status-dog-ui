import type { RequestHandler } from '@sveltejs/kit';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { rpID, rpName, type Authenticator, type UserModel } from '$lib/webauthn/models';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { existsUser } from '$lib/db/user-repo';
import { generateUserId } from '$lib/db/user_ids';

function setUserCurrentChallenge(user: UserModel, challenge: string) {
	console.info('TODO');
}

interface CreationOptionsParams extends Record<string, string> {
	email: string;
}

export const POST: RequestHandler<
	CreationOptionsParams,
	PublicKeyCredentialCreationOptionsJSON | string
> = async ({ request }) => {
	const params: CreationOptionsParams = await request.json();
	console.info('Generating registration options for', params);

	if (await existsUser(params.email)) {
		return {
			status: 409,
			body: 'A user with that email already exists.',
		};
	}
	const userId = await generateUserId();

	const options = generateRegistrationOptions({
		rpName,
		rpID,
		userID: userId.toString(),
		userName: params.email,
		// Don't prompt users for additional information about the authenticator
		// (Recommended for smoother UX)
		attestationType: 'indirect',

		// Prevent users from re-registering existing authenticators
		// excludeCredentials: userAuthenticators.map((authenticator) => ({
		// 	id: authenticator.credentialID,
		// 	type: 'public-key',
		// 	// Optional
		// 	transports: authenticator.transports
		// }
		// ))
	});

	// TODO
	//setUserCurrentChallenge(user, options.challenge);
	return { status: 200, body: options };
};
