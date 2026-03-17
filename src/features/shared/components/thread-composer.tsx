"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/common/error-message";
import { sendThreadMessageAction, type ThreadActionState } from "@/features/shared/actions/shared-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ThreadComposerProps = {
  sharedTopicId: string;
};

const initialState: ThreadActionState = {
  ok: false,
  message: "",
};

export function ThreadComposer({ sharedTopicId }: ThreadComposerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(sendThreadMessageAction, initialState);

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    formRef.current?.reset();

    if (state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form
      action={formAction}
      ref={formRef}
      style={{ display: "grid", gap: 10 }}
    >
      <input name="sharedTopicId" type="hidden" value={sharedTopicId} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
        <Input name="body" placeholder="メッセージ" />
        <Button disabled={isPending} type="submit">
          送信
        </Button>
      </div>
      {state.message ? <ErrorMessage message={state.message} tone={state.ok ? "success" : "error"} /> : null}
    </form>
  );
}
