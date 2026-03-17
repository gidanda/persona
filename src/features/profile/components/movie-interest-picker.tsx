"use client";

import { ContentInterestPicker } from "@/features/profile/components/content-interest-picker";
import type { ProfileInterestInput } from "@/types/profile";

type MovieInterestPickerProps = {
  index: number;
  interest?: ProfileInterestInput;
};

export function MovieInterestPicker({ index, interest }: MovieInterestPickerProps) {
  return (
    <ContentInterestPicker
      emptyMessage="候補が見つかりませんでした。"
      endpoint="/api/movie/search"
      index={index}
      interest={interest}
      placeholder="映画タイトルで検索"
      provider="tmdb"
    />
  );
}
