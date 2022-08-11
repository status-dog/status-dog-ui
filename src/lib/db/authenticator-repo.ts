import { doWithTransaction } from '$lib/db/postgres';
import type { NewAuthenticator } from '$lib/webauthn/models';

export async function persistAuthenticator(
	authenticator: NewAuthenticator,
	userId: number
): Promise<void> {
	console.info('Persist authenticator', authenticator);
	return await doWithTransaction(async (connection) => {
		await connection.query(
			'INSERT INTO statusdog.authenticators (name, credential_id, credential_public_key, counter, transports, user_id) VALUES($1, $2, $3, $4, $5, $6)',
			[
				'initial',
				authenticator.credentialID.toString('base64'),
				authenticator.credentialPublicKey,
				authenticator.counter,
				authenticator.transports || null,
				userId,
			]
		);
		return;
	});
}
