import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { IconSearch } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { getContacts } from "@/features/contacts/actions/contact-actions";

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
      <div style={{ display: "grid", gap: 8 }} />
      <form action={routes.contacts} method="get" style={{ position: "relative" }}>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            display: "inline-flex",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <IconSearch />
        </span>
        <Input
          defaultValue={query}
          name="q"
          placeholder="検索"
          style={{ paddingLeft: 42 }}
        />
      </form>
      {contacts.map((contact) => (
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
            <Link
              href={`/exchange/${contact.partner.userId}`}
              style={{ display: "flex", gap: 12, color: "inherit", textDecoration: "none", alignItems: "center" }}
            >
              <Avatar label={contact.partner.displayName} size={56} />
              <div>
                <h3 style={{ margin: "0 0 6px" }}>{contact.partner.displayName}</h3>
                {contact.partner.bio ? (
                  <p style={{ margin: 0, color: "var(--muted)" }}>{contact.partner.bio}</p>
                ) : null}
              </div>
            </Link>
            {contact.isFavorite ? (
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: "rgba(244, 114, 182, 0.18)",
                  color: "#f9a8d4",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Favorite
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
