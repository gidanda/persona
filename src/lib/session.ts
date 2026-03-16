import type { Session } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ACCESS_TOKEN_COOKIE = "persona-access-token";
const REFRESH_TOKEN_COOKIE = "persona-refresh-token";

function buildCookieOptions(maxAge?: number) {
  const useSecureCookies =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: useSecureCookies,
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

export async function setAuthSession(session: Session) {
  const cookieStore = await cookies();
  const maxAge = typeof session.expires_in === "number" ? session.expires_in : undefined;

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, buildCookieOptions(maxAge));
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, buildCookieOptions(maxAge));
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

export async function getCurrentAppUser() {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userId: true,
      displayName: true,
      realName: true,
      profileCompleted: true,
    },
  });
}

export async function requireSessionUserId() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect(routes.login);
  }

  return userId;
}

export async function requireCompletedAppUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect(routes.login);
  }

  if (!user.profileCompleted) {
    redirect(routes.profileEdit);
  }

  return user;
}

export async function redirectAuthenticatedUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    return;
  }

  redirect(user.profileCompleted ? routes.contacts : routes.profileEdit);
}
