import { getAuthenticator, updateCounter } from "$lib/db/authenticator-repo";
import { getUserById } from "$lib/db/user-repo";
import { rpID, statusDogOrigin } from "$lib/webauthn/models";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationCredentialJSON } from "@simplewebauthn/typescript-types";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler<Record<string, string>, string> = async ({ request }) => {
  const params: AuthenticationCredentialJSON = await request.json();
  console.info("Verify authentication");
  const authenticator = await getAuthenticator(params.id);
  if (!authenticator) {
    return { status: 401, body: "Failed" };
  }
  const user = await getUserById(authenticator?.userId);
  if (!user || !user.currentChallenge) {
    return { status: 401, body: "Failed" };
  }

  try {
    const verification = await verifyAuthenticationResponse({
      credential: params,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: statusDogOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: authenticator.counter,
        transports: authenticator.transports || undefined,
      },
    });
    if (verification.verified) {
      await updateCounter(authenticator.id, verification.authenticationInfo.newCounter);
      return { status: 200, body: "{}" };
    } else {
      return { status: 401, body: "{}" };
    }
  } catch (error) {
    console.error(error);
    return { status: 400, body: "Failed" };
  }
};
