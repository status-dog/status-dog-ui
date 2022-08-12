import { doWithoutTransaction, doWithTransaction } from "$lib/db/postgres";
import type { Authenticator, NewAuthenticator } from "$lib/webauthn/models";
import type { QueryResultRow } from "pg";

export async function persistAuthenticator(authenticator: NewAuthenticator): Promise<void> {
  console.info("Persist authenticator", authenticator);
  return await doWithTransaction(async (connection) => {
    await connection.query(
      "INSERT INTO statusdog.authenticators (name, credential_id, credential_public_key, counter, transports, user_id) VALUES($1, $2, $3, $4, $5, $6)",
      [
        "initial",
        authenticator.credentialID.toString("base64url"),
        authenticator.credentialPublicKey,
        authenticator.counter,
        authenticator.transports,
        authenticator.userId,
      ]
    );
    return;
  });
}

function rowToAuthenticator(row: QueryResultRow): Authenticator {
  const authenticator: Authenticator = {
    id: row.id,
    name: row.name,
    credentialID: Buffer.from(row.credential_id, "base64url"),
    credentialPublicKey: row.credential_public_key,
    counter: row.counter,
    transports: row.transports,
    userId: row.user_id,
  };
  return authenticator;
}

export async function getAuthenticator(credentialId: string): Promise<Authenticator | null> {
  console.info("Get authenticator", credentialId);
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select id, name, credential_id, credential_public_key, counter, transports, user_id from statusdog.authenticators where credential_id = $1",
      [credentialId]
    );
    if (result.rowCount !== 1) {
      return null;
    } else {
      return rowToAuthenticator(result.rows[0]);
    }
  });
}

export async function getAuthenticators(userId: number): Promise<Authenticator[]> {
  console.info("Get authenticators");
  return await doWithoutTransaction(async (connection) => {
    const result = await connection.query(
      "select id, name, credential_id, credential_public_key, counter, transports, user_id from statusdog.authenticators where user_id = $1",
      [userId]
    );
    return result.rows.map(rowToAuthenticator);
  });
}
