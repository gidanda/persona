import { redirect } from "next/navigation";

import { routes } from "@/constants/routes";
import { requireCompletedAppUser } from "@/lib/session";

export default async function HomePage() {
  await requireCompletedAppUser();

  redirect(routes.contacts);
}
