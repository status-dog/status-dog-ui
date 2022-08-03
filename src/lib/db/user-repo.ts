import { doWithoutTransaction } from '$lib/db/postgres';

export async function existsUser(email: string): Promise<boolean> {
	console.info("Check if user exists.")
	return await doWithoutTransaction(async connection => {
		const result = await connection.query(
			'select count(id) as cnt from statusdog.users where email = $1',
			[email],
		);
		return result.rows[0].cnt > 0;
	})
}
