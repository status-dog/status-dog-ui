
import { pool } from '$lib/db/postgres';

export async function generateUserId(): Promise<number> {
	const connnection = await pool.connect();
	try {
		const result = await connnection.query(
			"select nextval('user_ids') as userId"
		);
		return result.rows[0].userId;
	} finally {
		connnection.release();
	}
}
