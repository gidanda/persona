"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { routes } from "@/constants/routes";
import { buildRelationshipPair, normalizeTopicKey } from "@/features/shared/utils/topic";
import { prisma } from "@/lib/prisma";
import { requireCompletedAppUser } from "@/lib/session";

type TopicCard = {
  id: string;
  topicLabel: string;
  topicType: string;
  origin: string;
  sourceContext: string;
  state: string;
  lastActivityAt: string;
  messageCount: number;
};

export type SharedPartnerSummary = {
  partner: {
    id: string;
    userId: string;
    displayName: string;
    bio: string;
  };
  topics: TopicCard[];
  lastActivityAt: string;
};

export type SharedTopicDetail = {
  id: string;
  topicLabel: string;
  topicType: string;
  origin: string;
  sourceContext: string;
  state: string;
  partner: {
    id: string;
    userId: string;
    displayName: string;
  };
  messages: {
    id: string;
    body: string;
    senderUserId: string;
    senderDisplayName: string;
    createdAt: string;
  }[];
  currentUserId: string;
};

export type SharedActionState = {
  ok: boolean;
  message: string;
};

export type ThreadActionState = SharedActionState & {
  redirectTo?: string;
};

const initialState = {
  ok: false,
  message: "",
} satisfies SharedActionState;

async function requireConnectedPartner(currentUserId: string, partnerUserId: string) {
  const connection = await prisma.connection.findFirst({
    where: {
      userId: currentUserId,
      partner: {
        userId: partnerUserId,
      },
    },
    include: {
      partner: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!connection) {
    return null;
  }

  return connection.partner;
}

async function getOrCreateRelationship(currentUserId: string, partnerId: string) {
  const [userAId, userBId] = buildRelationshipPair(currentUserId, partnerId);

  return prisma.relationship.upsert({
    where: {
      userAId_userBId: {
        userAId,
        userBId,
      },
    },
    update: {},
    create: {
      userAId,
      userBId,
    },
  });
}

function mapTopicCard(topic: {
  id: string;
  topicLabel: string;
  topicType: string;
  origin: string;
  sourceContext: string;
  state: string;
  lastActivityAt: Date;
  _count?: { messages: number };
}) {
  return {
    id: topic.id,
    topicLabel: topic.topicLabel,
    topicType: topic.topicType,
    origin: topic.origin,
    sourceContext: topic.sourceContext,
    state: topic.state,
    lastActivityAt: topic.lastActivityAt.toISOString(),
    messageCount: topic._count?.messages ?? 0,
  } satisfies TopicCard;
}

export async function getSharedPartners() {
  const currentUser = await requireCompletedAppUser();
  const topics = await prisma.sharedTopic.findMany({
    where: {
      relationship: {
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
    },
    orderBy: {
      lastActivityAt: "desc",
    },
    include: {
      relationship: {
        include: {
          userA: {
            include: {
              profile: true,
            },
          },
          userB: {
            include: {
              profile: true,
            },
          },
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const partnerMap = new Map<string, SharedPartnerSummary>();

  for (const topic of topics) {
    const partner =
      topic.relationship.userAId === currentUser.id ? topic.relationship.userB : topic.relationship.userA;

    const existing = partnerMap.get(partner.id);
    const topicCard = mapTopicCard(topic);

    if (existing) {
      existing.topics.push(topicCard);
      continue;
    }

    partnerMap.set(partner.id, {
      partner: {
        id: partner.id,
        userId: partner.userId,
        displayName: partner.displayName,
        bio: partner.profile?.bio ?? "",
      },
      topics: [topicCard],
      lastActivityAt: topic.lastActivityAt.toISOString(),
    });
  }

  return Array.from(partnerMap.values());
}

export async function getSharedTopicsByPartner(partnerUserId: string) {
  const currentUser = await requireCompletedAppUser();
  const partner = await requireConnectedPartner(currentUser.id, partnerUserId);

  if (!partner) {
    return null;
  }

  const [userAId, userBId] = buildRelationshipPair(currentUser.id, partner.id);
  const relationship = await prisma.relationship.findUnique({
    where: {
      userAId_userBId: {
        userAId,
        userBId,
      },
    },
    include: {
      sharedTopics: {
        include: {
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          lastActivityAt: "desc",
        },
      },
    },
  });

  return {
    partner: {
      id: partner.id,
      userId: partner.userId,
      displayName: partner.displayName,
      bio: partner.profile?.bio ?? "",
    },
    topics: relationship?.sharedTopics.map(mapTopicCard) ?? [],
  };
}

export async function getSharedTopicDetail(topicId: string): Promise<SharedTopicDetail | null> {
  const currentUser = await requireCompletedAppUser();
  const topic = await prisma.sharedTopic.findFirst({
    where: {
      id: topicId,
      relationship: {
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
    },
    include: {
      relationship: {
        include: {
          userA: true,
          userB: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: true,
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  const partner = topic.relationship.userAId === currentUser.id ? topic.relationship.userB : topic.relationship.userA;

  return {
    id: topic.id,
    topicLabel: topic.topicLabel,
    topicType: topic.topicType,
    origin: topic.origin,
    sourceContext: topic.sourceContext,
    state: topic.state,
    partner: {
      id: partner.id,
      userId: partner.userId,
      displayName: partner.displayName,
    },
    messages: topic.messages.map((message) => ({
      id: message.id,
      body: message.body,
      senderUserId: message.senderUserId,
      senderDisplayName: message.sender.displayName,
      createdAt: message.createdAt.toISOString(),
    })),
    currentUserId: currentUser.id,
  };
}

export async function createReactionAction(
  _prevState: SharedActionState = initialState,
  formData: FormData,
): Promise<SharedActionState> {
  const currentUser = await requireCompletedAppUser();
  const partnerUserId = String(formData.get("partnerUserId") ?? "");
  const topicLabel = String(formData.get("topicLabel") ?? "").trim();
  const topicType = String(formData.get("topicType") ?? "theme").trim();
  const sourceContext = String(formData.get("sourceContext") ?? "profile_interest").trim() as
    | "profile_interest"
    | "profile_thinking"
    | "profile_doing"
    | "profile_bio";
  const origin = String(formData.get("origin") ?? "empathy").trim() as "empathy" | "interest";

  if (!partnerUserId || !topicLabel) {
    return {
      ok: false,
      message: "項目を確認してください。",
    };
  }

  const partner = await requireConnectedPartner(currentUser.id, partnerUserId);

  if (!partner) {
    return {
      ok: false,
      message: "Shared を作成できませんでした。",
    };
  }

  const relationship = await getOrCreateRelationship(currentUser.id, partner.id);
  const normalizedKey = normalizeTopicKey(topicLabel);
  const now = new Date();

  await prisma.sharedTopic.upsert({
    where: {
      relationshipId_sourceContext_normalizedKey: {
        relationshipId: relationship.id,
        sourceContext,
        normalizedKey,
      },
    },
    update: {
      topicLabel,
      topicType,
      origin,
      lastActivityAt: now,
    },
    create: {
      relationshipId: relationship.id,
      topicLabel,
      topicType,
      normalizedKey,
      origin,
      sourceContext,
      createdByUserId: currentUser.id,
      lastActivityAt: now,
    },
  });

  revalidatePath(`/exchange/${partner.userId}`);
  revalidatePath(`${routes.shared}/${partner.userId}`);
  revalidatePath(routes.shared);

  return {
    ok: true,
    message: "",
  };
}

export async function sendThreadMessageAction(
  _prevState: ThreadActionState,
  formData: FormData,
): Promise<ThreadActionState> {
  const currentUser = await requireCompletedAppUser();
  const sharedTopicId = String(formData.get("sharedTopicId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!sharedTopicId || !body) {
    return {
      ok: false,
      message: "メッセージを入力してください。",
    };
  }

  const topic = await prisma.sharedTopic.findFirst({
    where: {
      id: sharedTopicId,
      relationship: {
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
    },
    select: {
      id: true,
    },
  });

  if (!topic) {
    return {
      ok: false,
      message: "Topic が見つかりません。",
    };
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.threadMessage.create({
      data: {
        sharedTopicId,
        senderUserId: currentUser.id,
        body,
      },
    }),
    prisma.sharedTopic.update({
      where: {
        id: sharedTopicId,
      },
      data: {
        state: "active_thread",
        lastActivityAt: now,
      },
    }),
  ]);

  revalidatePath(`${routes.shared}/topic/${sharedTopicId}`);
  return {
    ok: true,
    message: "",
    redirectTo: `${routes.shared}/topic/${sharedTopicId}`,
  };
}

export async function openSharedForPartner(partnerUserId: string) {
  const currentUser = await requireCompletedAppUser();
  const partner = await requireConnectedPartner(currentUser.id, partnerUserId);

  if (!partner) {
    redirect(routes.shared);
  }

  redirect(`${routes.shared}/${partnerUserId}`);
}
