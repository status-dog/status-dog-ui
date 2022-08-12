import type { AuthenticatorTransportFuture } from "@simplewebauthn/typescript-types";

// Human-readable title for your website
export const rpName = "status dog";

// A unique identifier for your website
// TODO read from env
export const rpID = "localhost";

// The URL at which registrations and authentications should occur
// TODO: read from env
export const statusDogOrigin = `http://${rpID}:5173`;

/**
 * It is strongly advised that authenticators get their own DB
 * table, ideally with a foreign key to a specific UserModel.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
export type Authenticator = {
  id: number;

  name: string;
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  credentialID: Buffer;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  credentialPublicKey: Buffer;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // ['usb' | 'ble' | 'nfc' | 'internal']
  transports: AuthenticatorTransportFuture[] | null;

  userId: number;
};

export type NewAuthenticator = Omit<Authenticator, "id">;
