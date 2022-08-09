import { ClientBase, Pool } from 'pg';

export const pool = new Pool({
	// TODO use env variables
	user: 'statusdog',
	host: 'localhost',
	database: 'statusdog',
	password: 'statusdog',
	port: 5432,
});

export async function doWithoutTransaction<T>(dbCode: (client: ClientBase) => Promise<T>) {
	const connnection = await pool.connect();
	try {
		const result = await dbCode(connnection);
		return result;
	} catch (e) {
		console.trace('DB operation failed.', e);
		throw e;
	} finally {
		connnection.release();
	}
}

export async function doWithTransaction<T>(dbCode: (client: ClientBase) => Promise<T>) {
	const connnection = await pool.connect();
	try {
		await connnection.query('BEGIN');
		const result = await dbCode(connnection);
		await connnection.query('COMMIT');
		return result;
	} catch (e) {
		await connnection.query('ROLLBACK');
		console.trace('DB operation failed.', e);
		throw e;
	} finally {
		connnection.release();
	}
}
