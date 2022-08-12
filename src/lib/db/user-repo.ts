import { doWithoutTransaction, doWithTransaction } from "$lib/db/postgres";
import type { User } from "$lib/user/user";
import type { QueryResultRow } from "pg";

export async function existsUser(email: string): Promise<boolean> {
  console.info("Check if user exists.");
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select count(id) as cnt from statusdog.users where email = $1",
      [email]
    );
    return result.rows[0].cnt > 0;
  });
}

function rowToUser(row: QueryResultRow): User {
  return {
    id: row.id,
    email: row.email,
    currentChallenge: row.current_challenge,
  };
}

export async function getUserById(userId: number): Promise<User | undefined> {
  console.info("Get user by id");
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select id, email, current_challenge  from statusdog.users where id = $1",
      [userId]
    );
    if (result.rowCount !== 1) {
      return undefined;
    } else {
      return rowToUser(result.rows[0]);
    }
  });
}

export async function getUser(email: string): Promise<User | undefined> {
  console.info("Get user by email");
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select id, email, current_challenge  from statusdog.users where email = $1",
      [email]
    );
    if (result.rowCount !== 1) {
      return undefined;
    } else {
      return rowToUser(result.rows[0]);
    }
  });
}

export async function persistUser(user: User): Promise<void> {
  console.info("Persist new user");
  return await doWithTransaction(async (connection) => {
    await connection.query(
      "INSERT INTO statusdog.users (id, email, current_challenge) VALUES($1, $2, $3);",
      [user.id, user.email, user.currentChallenge]
    );
    return;
  });
}

export async function persistUserChallenge(
  userId: number,
  challenge: string | null
): Promise<void> {
  console.info("Persist new challenge");
  return await doWithTransaction(async (connection) => {
    await connection.query("update  statusdog.users set current_challenge = $1 where id = $2", [
      challenge,
      userId,
    ]);
    return;
  });
}
