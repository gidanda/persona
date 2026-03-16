"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { requireCompletedAppUser } from "@/lib/session";

export type ContactListItem = {
  id: string;
  partner: {
    userId: string;
    displayName: string;
    realName: string;
    bio: string;
    avatarImageUrl: string | null;
  };
  isFavorite: boolean;
  exchangedAt: string;
};

export async function getContacts(query?: string) {
  const user = await requireCompletedAppUser();
  const normalizedQuery = query?.trim();
  const connections = await prisma.connection.findMany({
    where: {
      userId: user.id,
      ...(normalizedQuery
        ? {
            OR: [
              {
                partner: {
                  userId: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                partner: {
                  displayName: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                partner: {
                  realName: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                partner: {
                  profile: {
                    is: {
                      bio: {
                        contains: normalizedQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: [{ isFavorite: "desc" }, { exchangedAt: "desc" }],
    include: {
      partner: {
        include: {
          profile: true,
        },
      },
    },
  });

  return connections.map((connection) => ({
    id: connection.id,
    partner: {
      userId: connection.partner.userId,
      displayName: connection.partner.displayName,
      realName: connection.partner.realName,
      bio: connection.partner.profile?.bio ?? "",
      avatarImageUrl: connection.partner.profile?.avatarImageUrl ?? null,
    },
    isFavorite: connection.isFavorite,
    exchangedAt: connection.exchangedAt.toISOString(),
  })) satisfies ContactListItem[];
}

export async function toggleFavoriteAction(formData: FormData) {
  const user = await requireCompletedAppUser();
  const connectionId = String(formData.get("connectionId") ?? "");

  if (!connectionId) {
    return;
  }

  const connection = await prisma.connection.findFirst({
    where: {
      id: connectionId,
      userId: user.id,
    },
    select: {
      id: true,
      isFavorite: true,
    },
  });

  if (!connection) {
    return;
  }

  await prisma.connection.update({
    where: {
      id: connection.id,
    },
    data: {
      isFavorite: !connection.isFavorite,
    },
  });

  revalidatePath(routes.contacts);
}
