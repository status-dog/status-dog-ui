import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { rpID, rpName } from "$lib/webauthn/models";
import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";
import { existsUser } from "$lib/db/user-repo";
import { generateUserId } from "$lib/db/user_ids";
import { persistRegistration } from "$lib/db/pending-registrations-repo";
import type { CreationOptionsParams } from "$lib/signup/model";

export const POST: RequestHandler = async ({ request }) => {
  const params: CreationOptionsParams = await request.json();
  console.info("Generating registration options");

  if (await existsUser(params.email)) {
    return new Response("A user with that email already exists.", { status: 409 });
  }
  const userId = await generateUserId();

  const options: PublicKeyCredentialCreationOptionsJSON = generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId.toString(),
    userName: params.email,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "indirect",
    timeout: 1000 * 60 * 5,

    // Prevent users from re-registering existing authenticators
    // excludeCredentials: userAuthenticators.map((authenticator) => ({
    // 	id: authenticator.credentialID,
    // 	type: 'public-key',
    // 	// Optional
    // 	transports: authenticator.transports
    // }
    // ))
  });

  await persistRegistration({
    id: userId,
    email: params.email,
    challenge: options.challenge,
  });

  return json(options);
};
