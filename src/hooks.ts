import { getUserIdForSession } from "$lib/db/session-repo";
import { SESSION_COOKIE_NAME } from "$lib/session/cookie";
import type { Handle } from "@sveltejs/kit";
import * as cookie from "cookie";

export const handle: Handle = async ({ event, resolve }) => {
  const cookieHeader = event.request.headers.get("cookie");
  const cookies = cookie.parse(cookieHeader ?? "");

  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) {
    return await resolve(event);
  }

  const userId = await getUserIdForSession(sessionId);

  if (userId) {
    event.locals.userId = userId;
    event.locals.sessionId = sessionId;
  }

  return await resolve(event);
};
