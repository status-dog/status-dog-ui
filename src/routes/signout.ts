import { deleteSession } from "$lib/db/session-repo";
import { SESSION_COOKIE_NAME } from "$lib/session/cookie";
import type { RequestHandler } from "@sveltejs/kit";
import * as cookie from "cookie";

export const GET: RequestHandler = async ({ locals }) => {
  if (locals.sessionId) {
    await deleteSession(locals.sessionId);
  }
  return {
    status: 303,
    headers: {
      "Set-Cookie": cookie.serialize(SESSION_COOKIE_NAME, "", {
        path: "/",
        // the cookie should expire immediately
        expires: new Date(0),
      }),
      location: "/",
    },
  };
};
