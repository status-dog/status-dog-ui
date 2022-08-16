import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ session }) => {
  if (!session.userSession) {
    throw redirect(302, "/signin");
  }

  return {};
};
