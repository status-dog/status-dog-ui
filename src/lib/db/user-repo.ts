import { pool } from '$lib/db/postgres';

export async function existsUser(email: string): Promise<boolean> {
	const connnection = await pool.connect();
	try {
		const result = await connnection.query(
			'select count(id) as cnt from statusdog.users where email = ?',
			[email]
		);
		return result.rows[0].cnt > 0;
	} finally {
		connnection.release();
	}
}
