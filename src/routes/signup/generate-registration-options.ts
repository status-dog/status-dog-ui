import type { RequestHandler } from '@sveltejs/kit';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { rpID, rpName, type Authenticator, type UserModel } from '$lib/webauthn/models';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

function getUserFromDB(email: String): UserModel {
	return {
		id: '1',
		username: 'ralph',
		currentChallenge: undefined
	};
}

function getUserAuthenticators(user: UserModel): Authenticator[] {
	console.info('TODO');
	return [];
}

function setUserCurrentChallenge(user: UserModel, challenge: string) {
	console.info('TODO');
}

interface CreationOptionsParams extends Record<string, string> {
	email: string;
}

export const POST: RequestHandler<
	CreationOptionsParams,
	PublicKeyCredentialCreationOptionsJSON
> = async ({ request }) => {
	const params: CreationOptionsParams = await request.json();
	console.info('Generating registration options for', params);

	const user: UserModel = getUserFromDB('test@test.de');
	const userAuthenticators: Authenticator[] = getUserAuthenticators(user);

	const options = generateRegistrationOptions({
		rpName,
		rpID,
		userID: user.id,
		userName: params.email,
		// Don't prompt users for additional information about the authenticator
		// (Recommended for smoother UX)
		attestationType: 'indirect',
		// Prevent users from re-registering existing authenticators
		excludeCredentials: userAuthenticators.map((authenticator) => ({
			id: authenticator.credentialID,
			type: 'public-key',
			// Optional
			transports: authenticator.transports
		}))
	});

	setUserCurrentChallenge(user, options.challenge);
	return { status: 200, body: options };
};
