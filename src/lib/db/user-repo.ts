import { doWithoutTransaction, doWithTransaction } from '$lib/db/postgres';
import type { User } from '$lib/user/user';

export async function existsUser(email: string): Promise<boolean> {
	console.info('Check if user exists.');
	return await doWithoutTransaction(async (connection) => {
		const result = await connection.query(
			'select count(id) as cnt from statusdog.users where email = $1',
			[email]
		);
		return result.rows[0].cnt > 0;
	});
}

export async function persistUser(user: User): Promise<void> {
	console.info('Persist new user');
	return await doWithTransaction(async (connection) => {
		await connection.query(
			'INSERT INTO statusdog.users (id, email, current_challenge) VALUES($1, $2, $3);',
			[user.id, user.email, user.currentChallenge || null]
		);
		return;
	});
}
