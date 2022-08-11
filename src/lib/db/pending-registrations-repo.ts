import { doWithTransaction } from '$lib/db/postgres';

interface PendingRegistration {
	id: number;
	email: string;
	challenge: string;
}

export async function persistRegistration(registration: PendingRegistration): Promise<void> {
	console.info('Persist pending registration');
	return await doWithTransaction(async (connection) => {
		await connection.query('delete from statusdog.pending_registrations where expires  < now()');
		await connection.query(
			"insert into statusdog.pending_registrations (id, email, challenge, expires) values ($1, $2, $3, now() + interval '5 minutes')",
			[registration.id, registration.email, registration.challenge]
		);
		return;
	});
}

export async function getChallenge(id: number): Promise<string> {
	console.info('Fetch registration challenge');
	return await doWithTransaction(async (connection) => {
		await connection.query('delete from statusdog.pending_registrations where expires  < now()');
		const result = await connection.query(
			'select challenge from statusdog.pending_registrations where id = $1',
			[id]
		);
		if (result.rowCount != 1) {
			throw Error('Could not find pending registration');
		}
		const challenge: string = result.rows[0].challenge;
		return challenge;
	});
}
