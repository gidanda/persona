"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/common/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveProfileAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-actions";
import { BookInterestPicker } from "@/features/profile/components/book-interest-picker";
import { MusicInterestPicker } from "@/features/profile/components/music-interest-picker";
import { MovieInterestPicker } from "@/features/profile/components/movie-interest-picker";
import type { InterestCategory, ProfileDraft, SnsLinkType } from "@/types/profile";

type ProfileEditFormProps = {
  profile: ProfileDraft;
};

const initialState: ProfileActionState = {
  ok: false,
  message: "",
};

const snsTypeOptions: SnsLinkType[] = ["x", "instagram", "linkedin", "other"];
const interestCategoryOptions: InterestCategory[] = ["music", "movie", "book", "place", "theme", "other"];

function InterestField({
  index,
  interest,
}: {
  index: number;
  interest?: ProfileDraft["interests"][number];
}) {
  const [category, setCategory] = useState<InterestCategory>(interest?.category ?? "music");

  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: 14,
        borderRadius: 20,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <strong>Interest {index + 1}</strong>
      <select
        defaultValue={interest?.category ?? "music"}
        name={`interests.${index}.category`}
        onChange={(event) => setCategory(event.target.value as InterestCategory)}
        style={{
          width: "100%",
          padding: "13px 15px",
          borderRadius: "18px",
          border: "1px solid var(--line)",
          background: "var(--surface)",
          color: "var(--text)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(8,12,24,0.12)",
          outline: "none",
        }}
      >
        {interestCategoryOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {category === "music" ? (
        <MusicInterestPicker index={index} interest={interest} />
      ) : category === "movie" ? (
        <MovieInterestPicker index={index} interest={interest} />
      ) : category === "book" ? (
        <BookInterestPicker index={index} interest={interest} />
      ) : (
        <>
          <Input
            defaultValue={interest?.label ?? ""}
            name={`interests.${index}.label`}
            placeholder="Topic"
          />
          <input name={`interests.${index}.provider`} type="hidden" value={interest?.provider ?? ""} />
          <input name={`interests.${index}.externalId`} type="hidden" value={interest?.externalId ?? ""} />
          <input name={`interests.${index}.subtitle`} type="hidden" value={interest?.subtitle ?? ""} />
          <input name={`interests.${index}.imageUrl`} type="hidden" value={interest?.imageUrl ?? ""} />
          <input name={`interests.${index}.deeplinkUrl`} type="hidden" value={interest?.deeplinkUrl ?? ""} />
        </>
      )}
    </div>
  );
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveProfileAction, initialState);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} style={{ display: "grid", gap: 14, maxWidth: 640 }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span>Bio</span>
        <textarea
          defaultValue={profile.bio}
          name="bio"
          rows={5}
          style={{
            width: "100%",
            padding: "13px 15px",
            borderRadius: "18px",
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
            resize: "vertical",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(8,12,24,0.12)",
            outline: "none",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Thinking</span>
        <Input defaultValue={profile.thinkingNow} name="thinkingNow" placeholder="今考えていること" />
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Doing</span>
        <Input defaultValue={profile.doingNow} name="doingNow" placeholder="今取り組んでいること" />
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Avatar Image URL</span>
        <Input defaultValue={profile.avatarImageUrl ?? ""} name="avatarImageUrl" placeholder="Avatar Image URL" type="url" />
      </label>

      {[0, 1, 2].map((index) => {
        const interest = profile.interests[index];

        return <InterestField index={index} interest={interest} key={`interest-${index}`} />;
      })}

      {[0, 1].map((index) => {
        const snsLink = profile.snsLinks[index];

        return (
          <div
            key={index}
            style={{
              display: "grid",
              gap: 10,
              padding: 14,
              borderRadius: 20,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <strong>SNS Link {index + 1}</strong>
            <select
              defaultValue={snsLink?.type ?? "x"}
              name={`snsLinks.${index}.type`}
              style={{
                width: "100%",
                padding: "13px 15px",
                borderRadius: "18px",
                border: "1px solid var(--line)",
                background: "var(--surface)",
                color: "var(--text)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(8,12,24,0.12)",
                outline: "none",
              }}
            >
              {snsTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Input
              defaultValue={snsLink?.url ?? ""}
              name={`snsLinks.${index}.url`}
              placeholder="https://"
              type="url"
            />
          </div>
        );
      })}

      {state.message ? <ErrorMessage message={state.message} /> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
