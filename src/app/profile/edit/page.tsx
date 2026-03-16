import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { getMyProfile } from "@/features/profile/actions/profile-actions";

export default async function EditProfilePage() {
  const profile = await getMyProfile();

  if (!profile) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: 14, maxWidth: 640 }}>
      <div
        style={{
          display: "grid",
          gap: 10,
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>プロフィール編集</h2>
      </div>
      <ProfileEditForm profile={profile} />
    </section>
  );
}
