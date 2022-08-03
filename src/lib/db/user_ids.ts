import { doWithoutTransaction } from '$lib/db/postgres';

export async function generateUserId(): Promise<number> {
	console.info('Generating user id');
	return await doWithoutTransaction(async (connection) => {
		const result = await connection.query("select nextval('user_ids') as userid");
		return result.rows[0].userid;
	});
}
