import { doWithoutTransaction, doWithTransaction } from '$lib/db/postgres';
import type { Authenticator, NewAuthenticator } from '$lib/webauthn/models';

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
				authenticator.transports,
				userId,
			]
		);
		return;
	});
}

export async function getAuthenticators(userId: number): Promise<Authenticator[]> {
	console.info('Check if user exists.');
	return await doWithoutTransaction(async (connection) => {
		const result = await connection.query(
			'select id, name, credential_id, credential_public_key, counter, transports from statusdog.authenticators where user_id = $1',
			[userId]
		);
		return result.rows.map((row) => {
			const authenticator: Authenticator = {
				id: row.id,
				name: row.name,
				credentialID: Buffer.from(row.credential_id, 'base64'),
				credentialPublicKey: row.credential_public_key,
				counter: row.counter,
				transports: row.transports,
			};
			return authenticator;
		});
	});
}
