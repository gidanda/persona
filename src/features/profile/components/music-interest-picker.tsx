"use client";

import { ContentInterestPicker } from "@/features/profile/components/content-interest-picker";
import type { ProfileInterestInput } from "@/types/profile";

type MusicInterestPickerProps = {
  index: number;
  interest?: ProfileInterestInput;
};

export function MusicInterestPicker({ index, interest }: MusicInterestPickerProps) {
  return (
    <ContentInterestPicker
      emptyMessage="候補が見つかりませんでした。"
      endpoint="/api/music/search"
      index={index}
      interest={interest}
      placeholder="曲名やアーティスト名で検索"
      provider="spotify"
    />
  );
}
