"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/common/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, type AuthActionState } from "@/features/auth/actions/auth-actions";

const initialState: AuthActionState = {
  ok: false,
  message: "",
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} style={{ display: "grid", gap: 18, maxWidth: 520 }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Email</span>
        <Input aria-label="Email" autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Password</span>
        <Input
          aria-label="Password"
          autoComplete="current-password"
          name="password"
          placeholder="8文字以上"
          required
          type="password"
        />
      </label>
      {state.message ? <ErrorMessage message={state.message} /> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
}
