import { getUserById } from "$lib/db/user-repo";
import type { UserSession } from "$lib/session/user-session";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.userId) {
    throw redirect(302, "/signin");
  }
  const user = await getUserById(locals.userId);
  if (!user) {
    throw redirect(302, "/signin");
  }

  const userSession: UserSession = {
    email: user.email,
    userId: user.id,
  };

  return {
    userSession,
  };
};
