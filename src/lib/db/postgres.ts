import { Pool } from 'pg';

export const pool = new Pool({
	// TODO use env variables
	user: 'statusdog',
	host: 'localhost',
	database: 'statusdog',
	password: 'statusdog',
	port: 5432,
});
