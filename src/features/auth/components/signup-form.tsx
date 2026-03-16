"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/common/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction, type AuthActionState } from "@/features/auth/actions/auth-actions";

const initialState: AuthActionState = {
  ok: false,
  message: "",
};

export function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} style={{ display: "grid", gap: 14, maxWidth: 560 }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>User ID</span>
        <Input aria-label="User ID" autoComplete="username" name="userId" placeholder="hiroki" required />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Display Name</span>
        <Input aria-label="Display Name" name="displayName" placeholder="Hiroki" required />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Real Name</span>
        <Input aria-label="Real Name" name="realName" placeholder="Hiroki Example" required />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Email</span>
        <Input aria-label="Email" autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>Password</span>
        <Input
          aria-label="Password"
          autoComplete="new-password"
          name="password"
          placeholder="8文字以上"
          required
          type="password"
        />
      </label>
      {state.message ? <ErrorMessage message={state.message} tone={state.ok ? "success" : "error"} /> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "登録中..." : "登録する"}
      </Button>
    </form>
  );
}
