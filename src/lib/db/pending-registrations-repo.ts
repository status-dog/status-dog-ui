import { doWithoutTransaction } from '$lib/db/postgres';

interface PendingRegistration {
	id: number;
	email: string;
	challenge: string;
}

export async function persistRegistration(registration: PendingRegistration): Promise<void> {
	console.info('Persist pending registration');
	return await doWithoutTransaction(async (connection) => {
		await connection.query('delete from statusdog.pending_registrations where expires  < now()');
		await connection.query(
			"insert into statusdog.pending_registrations (id, email, challenge, expires) values ($1, $2, $3, now() + interval '5 minutes')",
			[registration.id, registration.email, registration.challenge]
		);
		return;
	});
}
