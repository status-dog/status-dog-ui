import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.userId) {
    throw redirect(302, "/dashboard");
  }

  return {};
};
