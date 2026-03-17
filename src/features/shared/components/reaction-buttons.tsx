"use client";

import { useActionState } from "react";

import { ErrorMessage } from "@/components/common/error-message";
import { createReactionAction, type SharedActionState } from "@/features/shared/actions/shared-actions";

type ReactionButtonsProps = {
  partnerUserId: string;
  topicLabel: string;
  topicType: string;
  sourceContext: "profile_interest" | "profile_thinking" | "profile_doing" | "profile_bio";
};

const initialState: SharedActionState = {
  ok: false,
  message: "",
};

export function ReactionButtons({
  partnerUserId,
  topicLabel,
  topicType,
  sourceContext,
}: ReactionButtonsProps) {
  const [state, formAction, isPending] = useActionState(createReactionAction, initialState);

  return (
    <form action={formAction} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <input name="partnerUserId" type="hidden" value={partnerUserId} />
      <input name="topicLabel" type="hidden" value={topicLabel} />
      <input name="topicType" type="hidden" value={topicType} />
      <input name="sourceContext" type="hidden" value={sourceContext} />
      <button
        disabled={isPending}
        name="origin"
        type="submit"
        value="empathy"
        style={{
          borderRadius: 999,
          padding: "8px 12px",
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          color: "var(--text)",
          cursor: "pointer",
        }}
      >
        共感
      </button>
      <button
        disabled={isPending}
        name="origin"
        type="submit"
        value="interest"
        style={{
          borderRadius: 999,
          padding: "8px 12px",
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.12)",
          color: "var(--text)",
          cursor: "pointer",
        }}
      >
        興味
      </button>
      {state.message ? <ErrorMessage message={state.message} tone={state.ok ? "success" : "error"} /> : null}
    </form>
  );
}
