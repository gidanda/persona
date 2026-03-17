"use server";

import { routes } from "@/constants/routes";
import type { ProfileInput } from "@/features/profile/schemas/profile-schema";
import { profileSchema } from "@/features/profile/schemas/profile-schema";
import { prisma } from "@/lib/prisma";
import { requireSessionUserId } from "@/lib/session";
import type { ProfileDraft, ProfileInterestInput, SnsLinkInput } from "@/types/profile";

export type ProfileActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function normalizeOptionalUrl(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function normalizeOptionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function normalizeTopicKey(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 140);
}

function normalizeOptionalField(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function buildSnsLinks(formData: FormData): SnsLinkInput[] {
  return [0, 1]
    .map((index) => {
      const type = String(formData.get(`snsLinks.${index}.type`) ?? "").trim();
      const url = String(formData.get(`snsLinks.${index}.url`) ?? "").trim();

      if (!type || !url) {
        return null;
      }

      return {
        type: type as SnsLinkInput["type"],
        url,
        sortOrder: index,
      };
    })
    .filter((link): link is SnsLinkInput => link !== null);
}

function buildInterests(formData: FormData): ProfileInterestInput[] {
  const interests = [0, 1, 2].map((index): ProfileInterestInput | null => {
    const category = String(formData.get(`interests.${index}.category`) ?? "").trim();
    const label = String(formData.get(`interests.${index}.label`) ?? "").trim();

    if (!category || !label) {
      return null;
    }

    return {
      category: category as ProfileInterestInput["category"],
      label,
      provider: normalizeOptionalField(String(formData.get(`interests.${index}.provider`) ?? "")),
      externalId: normalizeOptionalField(String(formData.get(`interests.${index}.externalId`) ?? "")),
      subtitle: normalizeOptionalField(String(formData.get(`interests.${index}.subtitle`) ?? "")),
      imageUrl: normalizeOptionalField(String(formData.get(`interests.${index}.imageUrl`) ?? "")),
      deeplinkUrl: normalizeOptionalField(String(formData.get(`interests.${index}.deeplinkUrl`) ?? "")),
      sortOrder: index,
    };
  });

  return interests.filter((interest): interest is ProfileInterestInput => interest !== null);
}

export async function saveProfile(input: ProfileInput): Promise<ProfileActionState> {
  const userId = await requireSessionUserId();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "入力内容を確認してください。",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!currentUser) {
    return {
      ok: false,
      message: "ユーザー情報が見つかりません。",
    };
  }

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      bio: parsed.data.bio,
      thinkingNow: normalizeOptionalText(parsed.data.thinkingNow),
      doingNow: normalizeOptionalText(parsed.data.doingNow),
      avatarImageUrl: normalizeOptionalUrl(parsed.data.avatarImageUrl),
      avatarSeed: currentUser.userId,
    },
    create: {
      userId,
      bio: parsed.data.bio,
      thinkingNow: normalizeOptionalText(parsed.data.thinkingNow),
      doingNow: normalizeOptionalText(parsed.data.doingNow),
      avatarImageUrl: normalizeOptionalUrl(parsed.data.avatarImageUrl),
      avatarSeed: currentUser.userId,
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction([
    prisma.snsLink.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.profileInterest.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { profileCompleted: true },
    }),
    ...(parsed.data.snsLinks.length > 0
      ? [
          prisma.snsLink.createMany({
            data: parsed.data.snsLinks.map((link) => ({
              profileId: profile.id,
              type: link.type,
              url: link.url,
              sortOrder: link.sortOrder,
            })),
          }),
        ]
      : []),
    ...(parsed.data.interests.length > 0
      ? [
          prisma.profileInterest.createMany({
            data: parsed.data.interests.map((interest) => ({
              profileId: profile.id,
              category: interest.category,
              label: interest.label,
              normalizedKey: normalizeTopicKey(interest.label),
              provider: interest.provider ?? null,
              externalId: interest.externalId ?? null,
              subtitle: interest.subtitle ?? null,
              imageUrl: interest.imageUrl ?? null,
              deeplinkUrl: interest.deeplinkUrl ?? null,
              sortOrder: interest.sortOrder,
            })),
          }),
        ]
      : []),
  ]);

  return {
    ok: true,
    message: "",
    redirectTo: routes.profile,
  };
}

export async function saveProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  return saveProfile({
    bio: String(formData.get("bio") ?? ""),
    thinkingNow: String(formData.get("thinkingNow") ?? ""),
    doingNow: String(formData.get("doingNow") ?? ""),
    avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
    snsLinks: buildSnsLinks(formData),
    interests: buildInterests(formData),
  });
}

export async function getMyProfile() {
  const userId = await requireSessionUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          snsLinks: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          interests: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    userId: user.userId,
    displayName: user.displayName,
    realName: user.realName,
    bio: user.profile?.bio ?? "",
    thinkingNow: user.profile?.thinkingNow ?? "",
    doingNow: user.profile?.doingNow ?? "",
    avatarImageUrl: user.profile?.avatarImageUrl ?? null,
    snsLinks: user.profile?.snsLinks ?? [],
    interests:
      user.profile?.interests.map((interest) => ({
        id: interest.id,
        category: interest.category,
        label: interest.label,
        provider: interest.provider ?? undefined,
        externalId: interest.externalId ?? undefined,
        subtitle: interest.subtitle ?? undefined,
        imageUrl: interest.imageUrl ?? undefined,
        deeplinkUrl: interest.deeplinkUrl ?? undefined,
        sortOrder: interest.sortOrder,
      })) ?? [],
  } satisfies ProfileDraft;
}
