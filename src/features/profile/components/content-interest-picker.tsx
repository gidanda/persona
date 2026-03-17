"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ErrorMessage } from "@/components/common/error-message";
import { Input } from "@/components/ui/input";
import type { ProfileInterestInput } from "@/types/profile";

type SearchItem = {
  externalId: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  deeplinkUrl: string | null;
};

type ContentInterestPickerProps = {
  index: number;
  interest?: ProfileInterestInput;
  endpoint: string;
  placeholder: string;
  provider: string;
  emptyMessage?: string;
};

export function ContentInterestPicker({
  index,
  interest,
  endpoint,
  placeholder,
  provider,
  emptyMessage,
}: ContentInterestPickerProps) {
  const [query, setQuery] = useState(interest?.label ?? "");
  const [selected, setSelected] = useState<SearchItem | null>(
    interest?.label
      ? {
          externalId: interest.externalId ?? "",
          title: interest.label,
          subtitle: interest.subtitle ?? "",
          imageUrl: interest.imageUrl ?? null,
          deeplinkUrl: interest.deeplinkUrl ?? null,
        }
      : null,
  );
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selected && query === selected.title) {
      return;
    }

    if (query.trim().length < 2) {
      setItems([]);
      setMessage("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { items?: SearchItem[]; message?: string };

        if (!response.ok) {
          setItems([]);
          setMessage(data.message ?? "検索に失敗しました。");
          return;
        }

        setItems(data.items ?? []);

        if ((data.items?.length ?? 0) === 0 && emptyMessage) {
          setMessage(emptyMessage);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setItems([]);
          setMessage("検索に失敗しました。");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [emptyMessage, endpoint, query, selected]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <Input
        onChange={(event) => {
          setQuery(event.target.value);
          setSelected(null);
        }}
        placeholder={placeholder}
        value={query}
      />

      <input name={`interests.${index}.label`} type="hidden" value={selected?.title ?? query} />
      <input name={`interests.${index}.provider`} type="hidden" value={selected ? provider : interest?.provider ?? ""} />
      <input name={`interests.${index}.externalId`} type="hidden" value={selected?.externalId ?? interest?.externalId ?? ""} />
      <input name={`interests.${index}.subtitle`} type="hidden" value={selected?.subtitle ?? interest?.subtitle ?? ""} />
      <input name={`interests.${index}.imageUrl`} type="hidden" value={selected?.imageUrl ?? interest?.imageUrl ?? ""} />
      <input name={`interests.${index}.deeplinkUrl`} type="hidden" value={selected?.deeplinkUrl ?? interest?.deeplinkUrl ?? ""} />

      {selected ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr",
            gap: 12,
            alignItems: "center",
            padding: 12,
            borderRadius: 18,
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              position: "relative",
            }}
          >
            {selected.imageUrl ? (
              <Image alt={selected.title} fill sizes="56px" src={selected.imageUrl} style={{ objectFit: "cover" }} unoptimized />
            ) : null}
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            <strong>{selected.title}</strong>
            {selected.subtitle ? <span style={{ color: "var(--muted)", fontSize: 14 }}>{selected.subtitle}</span> : null}
          </div>
        </div>
      ) : null}

      {!selected && items.length > 0 ? (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((item) => (
            <button
              key={item.externalId}
              onClick={() => {
                setSelected(item);
                setQuery(item.title);
                setItems([]);
                setMessage("");
              }}
              type="button"
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 12,
                alignItems: "center",
                padding: 12,
                borderRadius: 18,
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.05)",
                color: "inherit",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  position: "relative",
                }}
              >
                {item.imageUrl ? (
                  <Image alt={item.title} fill sizes="56px" src={item.imageUrl} style={{ objectFit: "cover" }} unoptimized />
                ) : null}
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                <strong>{item.title}</strong>
                {item.subtitle ? <span style={{ color: "var(--muted)", fontSize: 14 }}>{item.subtitle}</span> : null}
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>検索中...</p> : null}
      {message ? <ErrorMessage message={message} /> : null}
    </div>
  );
}
