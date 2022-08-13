import { doWithoutTransaction, doWithTransaction } from "$lib/db/postgres";

export async function persistSession(sessionId: string, userId: number): Promise<void> {
  console.info("Persist pending registration");
  return await doWithTransaction(async (connection) => {
    await connection.query("delete from statusdog.sessions where expires < now()");
    await connection.query("insert into statusdog.sessions (session_id, user_id) values ($1, $2)", [
      sessionId,
      userId,
    ]);
    return;
  });
}

export async function getUserIdForSession(sessionId: string): Promise<number | null> {
  console.info("Get user for session");
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select user_id  from statusdog.sessions where session_id  = $1 and expires > now()",
      [sessionId]
    );
    if (result.rowCount == 1) {
      return result.rows[0].user_id;
    } else {
      return null;
    }
  });
}
