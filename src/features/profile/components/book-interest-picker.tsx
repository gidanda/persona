"use client";

import { ContentInterestPicker } from "@/features/profile/components/content-interest-picker";
import type { ProfileInterestInput } from "@/types/profile";

type BookInterestPickerProps = {
  index: number;
  interest?: ProfileInterestInput;
};

export function BookInterestPicker({ index, interest }: BookInterestPickerProps) {
  return (
    <ContentInterestPicker
      emptyMessage="候補が見つかりませんでした。"
      endpoint="/api/book/search"
      index={index}
      interest={interest}
      placeholder="本のタイトルや著者名で検索"
      provider="google_books"
    />
  );
}
