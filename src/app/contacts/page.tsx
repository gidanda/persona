import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { getContacts, toggleFavoriteAction } from "@/features/contacts/actions/contact-actions";

type ContactsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const queryValue = resolvedSearchParams?.q;
  const query = typeof queryValue === "string" ? queryValue.trim() : "";
  const contacts = await getContacts(query);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ marginBottom: 8 }}>交換済み一覧</h2>
        <p style={{ color: "var(--muted)" }}>
          QR 交換した相手をあとから見返すための一覧です。今は交換日と最小プロフィール情報を表示しています。
        </p>
      </div>
      <form
        action={routes.contacts}
        method="get"
        style={{
          display: "grid",
          gap: 12,
          padding: 18,
          borderRadius: 22,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.04em" }}>
            SEARCH CONTACTS
          </span>
          <Input defaultValue={query} name="q" placeholder="名前 / user ID / bio で検索" />
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button type="submit">検索する</Button>
          {query ? (
            <Link href={routes.contacts}>
              <Button variant="secondary">クリア</Button>
            </Link>
          ) : null}
        </div>
      </form>
      {contacts.length === 0 ? (
        <EmptyState
          title={query ? "一致する相手が見つかりません" : "交換済みの相手がまだいません"}
          description={
            query
              ? "検索条件を変えるか、入力をクリアして一覧を見直してください。"
              : "QR 交換が完了すると、この画面に相手のプロフィールが並びます。"
          }
        />
      ) : (
        contacts.map((contact) => (
          <article
            key={contact.id}
            style={{
              padding: 18,
              borderRadius: 22,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Avatar label={contact.partner.displayName} size={56} />
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>{contact.partner.displayName}</h3>
                  <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>@{contact.partner.userId}</p>
                  <p style={{ margin: 0, color: "var(--muted)" }}>
                    {contact.partner.bio || contact.partner.realName}
                  </p>
                </div>
              </div>
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: contact.isFavorite ? "rgba(244, 114, 182, 0.18)" : "rgba(255,255,255,0.08)",
                  color: contact.isFavorite ? "#f9a8d4" : "var(--muted)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {contact.isFavorite ? "Favorite" : "Exchanged"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
                Exchanged at: {new Date(contact.exchangedAt).toLocaleDateString("ja-JP")}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/exchange/${contact.partner.userId}`}>
                  <Button variant="secondary">プロフィールを見る</Button>
                </Link>
                <form action={toggleFavoriteAction}>
                  <input name="connectionId" type="hidden" value={contact.id} />
                  <Button type="submit" variant="secondary">
                    {contact.isFavorite ? "お気に入り解除" : "お気に入りに追加"}
                  </Button>
                </form>
              </div>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
