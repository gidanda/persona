"use server";

import { routes } from "@/constants/routes";
import { extractProfileToken } from "@/features/qr/utils/qr";
import { prisma } from "@/lib/prisma";
import { requireCompletedAppUser } from "@/lib/session";

export type ExchangeActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function buildExchangeRoute(token: string) {
  return `/exchange/${token}`;
}

export async function createExchange(token: string): Promise<ExchangeActionState> {
  const currentUser = await requireCompletedAppUser();
  const partnerToken = extractProfileToken(token);

  if (!partnerToken) {
    return {
      ok: false,
      message: "QR値または user ID を入力してください。",
    };
  }

  if (partnerToken === currentUser.userId) {
    return {
      ok: false,
      message: "自分自身とは交換できません。",
    };
  }

  const partner = await prisma.user.findUnique({
    where: { userId: partnerToken },
    select: {
      id: true,
      userId: true,
      profileCompleted: true,
    },
  });

  if (!partner || !partner.profileCompleted) {
    return {
      ok: false,
      message: "相手のプロフィールが見つかりません。",
    };
  }

  const existing = await prisma.connection.findUnique({
    where: {
      userId_partnerUserId: {
        userId: currentUser.id,
        partnerUserId: partner.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: true,
      message: "",
      redirectTo: buildExchangeRoute(partner.userId),
    };
  }

  const exchangedAt = new Date();

  await prisma.$transaction([
    prisma.connection.create({
      data: {
        userId: currentUser.id,
        partnerUserId: partner.id,
        exchangedAt,
      },
    }),
    prisma.connection.create({
      data: {
        userId: partner.id,
        partnerUserId: currentUser.id,
        exchangedAt,
      },
    }),
  ]);

  return {
    ok: true,
    message: "",
    redirectTo: buildExchangeRoute(partner.userId),
  };
}

export async function createExchangeAction(
  _prevState: ExchangeActionState,
  formData: FormData,
): Promise<ExchangeActionState> {
  return createExchange(String(formData.get("qrValue") ?? ""));
}

export async function getExchangeProfile(token: string) {
  const currentUser = await requireCompletedAppUser();
  const partnerToken = extractProfileToken(token);

  if (!partnerToken) {
    return null;
  }

  const connection = await prisma.connection.findFirst({
    where: {
      userId: currentUser.id,
      partner: {
        userId: partnerToken,
      },
    },
    include: {
      partner: {
        include: {
          profile: {
            include: {
              snsLinks: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!connection) {
    return null;
  }

  return {
    exchangedAt: connection.exchangedAt.toISOString(),
    partner: {
      userId: connection.partner.userId,
      displayName: connection.partner.displayName,
      realName: connection.partner.realName,
      bio: connection.partner.profile?.bio ?? "",
      avatarImageUrl: connection.partner.profile?.avatarImageUrl ?? null,
      snsLinks: connection.partner.profile?.snsLinks ?? [],
    },
  };
}
