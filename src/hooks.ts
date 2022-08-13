import { getUserIdForSession } from "$lib/db/session-repo";
import { getUserById } from "$lib/db/user-repo";
import { SESSION_COOKIE_NAME } from "$lib/session/cookie";
import type { UserSession } from "$lib/session/user-session";
import type { GetSession, Handle } from "@sveltejs/kit";
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
  }

  return await resolve(event);
};

export const getSession: GetSession = async ({ locals }) => {
  if (!locals.userId) return {};

  const user = await getUserById(locals.userId);

  if (!user) return {};

  const userSession: UserSession = {
    userId: user.id,
    email: user.email,
  };
  return {
    userSession,
  };
};
