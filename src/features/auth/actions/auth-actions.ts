"use server";

import { Prisma } from "@prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { routes } from "@/constants/routes";
import type { LoginInput, SignupInput } from "@/features/auth/schemas/auth-schema";
import { loginSchema, signupSchema } from "@/features/auth/schemas/auth-schema";
import { clearAuthSession, setAuthSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function getValidationMessage() {
  return "入力内容を確認してください。";
}

function getSupabaseErrorMessage(message?: string) {
  if (!message) {
    return "認証に失敗しました。";
  }

  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }

  if (normalized.includes("email not confirmed")) {
    return "確認メールのリンクを開いてからログインしてください。";
  }

  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "このメールアドレスはすでに登録されています。";
  }

  if (normalized.includes("password")) {
    return "パスワードの条件を満たしていません。";
  }

  return "認証に失敗しました。設定と入力内容を確認してください。";
}

function getPrismaErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "そのユーザーIDはすでに使用されています。";
  }

  return "ユーザー情報の保存に失敗しました。";
}

function getUnexpectedAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("Supabase environment variables are not configured")) {
      return "Supabase 接続設定が不足しています。";
    }

    if (error.message.includes("Environment variable not found: DATABASE_URL")) {
      return "データベース接続設定が不足しています。";
    }

    if (error.message.includes("Can't reach database server")) {
      return "データベースに接続できません。接続設定を確認してください。";
    }
  }

  return "認証処理で予期しないエラーが発生しました。";
}

function getAuthActionErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return getPrismaErrorMessage(error);
  }

  return getUnexpectedAuthErrorMessage(error);
}

function toSafeUserId(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized.slice(0, 50) || "persona-user";
}

function buildFallbackUserId(user: SupabaseUser) {
  const metadataUserId =
    typeof user.user_metadata.userId === "string" ? user.user_metadata.userId : undefined;

  if (metadataUserId) {
    return toSafeUserId(metadataUserId);
  }

  const emailLocalPart = user.email?.split("@")[0];
  const base = toSafeUserId(emailLocalPart ?? user.id);
  const suffix = user.id.replace(/-/g, "").slice(0, 6);

  return `${base}-${suffix}`.slice(0, 50);
}

async function ensureAppUserFromAuth(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {};
  const userId = buildFallbackUserId(user);
  const displayName =
    typeof metadata.displayName === "string" && metadata.displayName.trim().length > 0
      ? metadata.displayName.trim()
      : userId;
  const realName =
    typeof metadata.realName === "string" && metadata.realName.trim().length > 0
      ? metadata.realName.trim()
      : displayName;
  const verificationValue =
    typeof metadata.verificationValue === "string" && metadata.verificationValue.trim().length > 0
      ? metadata.verificationValue.trim()
      : user.email ?? user.id;

  return prisma.user.upsert({
    where: { id: user.id },
    update: {
      userId,
      displayName,
      realName,
      verificationValue,
    },
    create: {
      id: user.id,
      userId,
      displayName,
      realName,
      verificationValue,
    },
    select: {
      profileCompleted: true,
    },
  });
}

export async function login(input: LoginInput): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: getValidationMessage(),
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error || !data.session || !data.user) {
      await clearAuthSession();

      return {
        ok: false,
        message: getSupabaseErrorMessage(error?.message),
      };
    }

    await setAuthSession(data.session);

    const user = await ensureAppUserFromAuth(data.user);

    return {
      ok: true,
      message: "",
      redirectTo: user?.profileCompleted ? routes.home : routes.profileEdit,
    };
  } catch (error) {
    console.error("login failed", error);

    return {
      ok: false,
      message: getAuthActionErrorMessage(error),
    };
  }
}

export async function signup(input: SignupInput): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: getValidationMessage(),
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userId: parsed.data.userId },
      select: { id: true },
    });

    if (existingUser) {
      return {
        ok: false,
        message: "そのユーザーIDはすでに使用されています。",
      };
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          userId: parsed.data.userId,
          displayName: parsed.data.displayName,
          realName: parsed.data.realName,
          verificationValue: parsed.data.email,
        },
      },
    });

    if (error || !data.user) {
      return {
        ok: false,
        message: getSupabaseErrorMessage(error?.message),
      };
    }

    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        userId: parsed.data.userId,
        displayName: parsed.data.displayName,
        realName: parsed.data.realName,
        verificationValue: parsed.data.email,
      },
      create: {
        id: data.user.id,
        userId: parsed.data.userId,
        displayName: parsed.data.displayName,
        realName: parsed.data.realName,
        verificationValue: parsed.data.email,
      },
    });

    if (!data.session) {
      return {
        ok: true,
        message: "アカウントを作成しました。確認メールのリンクを開いてからログインしてください。",
      };
    }

    await setAuthSession(data.session);

    return {
      ok: true,
      message: "",
      redirectTo: routes.profileEdit,
    };
  } catch (error) {
    console.error("signup failed while persisting app user", error);

    return {
      ok: false,
      message: getAuthActionErrorMessage(error),
    };
  }
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return login({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  return signup({
    userId: String(formData.get("userId") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    realName: String(formData.get("realName") ?? ""),
    verificationValue: "",
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
}

export async function logoutAction() {
  await clearAuthSession();
  redirect(routes.login);
}
