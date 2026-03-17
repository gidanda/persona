-- AlterEnum
CREATE TYPE "InterestCategory" AS ENUM ('music', 'movie', 'book', 'place', 'theme', 'other');
CREATE TYPE "SharedOrigin" AS ENUM ('empathy', 'interest', 'recommendation', 'reaction_to_recent');
CREATE TYPE "SharedSourceContext" AS ENUM ('profile_interest', 'profile_thinking', 'profile_doing', 'profile_bio');
CREATE TYPE "SharedState" AS ENUM ('passive_shared', 'active_thread', 'archived');

-- AlterTable
ALTER TABLE "profiles"
ADD COLUMN "thinking_now" VARCHAR(160),
ADD COLUMN "doing_now" VARCHAR(160);

-- CreateTable
CREATE TABLE "profile_interests" (
  "id" UUID NOT NULL,
  "profile_id" UUID NOT NULL,
  "category" "InterestCategory" NOT NULL,
  "label" VARCHAR(120) NOT NULL,
  "normalized_key" VARCHAR(140) NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "profile_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
  "id" UUID NOT NULL,
  "user_a_id" UUID NOT NULL,
  "user_b_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_topics" (
  "id" UUID NOT NULL,
  "relationship_id" UUID NOT NULL,
  "topic_type" VARCHAR(40) NOT NULL,
  "topic_label" VARCHAR(140) NOT NULL,
  "normalized_key" VARCHAR(160) NOT NULL,
  "origin" "SharedOrigin" NOT NULL,
  "source_context" "SharedSourceContext" NOT NULL,
  "state" "SharedState" NOT NULL DEFAULT 'passive_shared',
  "created_by_user_id" UUID NOT NULL,
  "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "shared_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_messages" (
  "id" UUID NOT NULL,
  "shared_topic_id" UUID NOT NULL,
  "sender_user_id" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "thread_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_interests_profile_id_idx" ON "profile_interests"("profile_id");
CREATE UNIQUE INDEX "profile_interests_profile_id_sort_order_key" ON "profile_interests"("profile_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "relationships_user_a_id_user_b_id_key" ON "relationships"("user_a_id", "user_b_id");
CREATE INDEX "relationships_user_a_id_idx" ON "relationships"("user_a_id");
CREATE INDEX "relationships_user_b_id_idx" ON "relationships"("user_b_id");

-- CreateIndex
CREATE UNIQUE INDEX "shared_topics_relationship_id_source_context_normalized_key_key"
ON "shared_topics"("relationship_id", "source_context", "normalized_key");
CREATE INDEX "shared_topics_relationship_id_idx" ON "shared_topics"("relationship_id");
CREATE INDEX "shared_topics_last_activity_at_idx" ON "shared_topics"("last_activity_at");

-- CreateIndex
CREATE INDEX "thread_messages_shared_topic_id_idx" ON "thread_messages"("shared_topic_id");
CREATE INDEX "thread_messages_sender_user_id_idx" ON "thread_messages"("sender_user_id");

-- AddForeignKey
ALTER TABLE "profile_interests"
ADD CONSTRAINT "profile_interests_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships"
ADD CONSTRAINT "relationships_user_a_id_fkey"
FOREIGN KEY ("user_a_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "relationships"
ADD CONSTRAINT "relationships_user_b_id_fkey"
FOREIGN KEY ("user_b_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_topics"
ADD CONSTRAINT "shared_topics_relationship_id_fkey"
FOREIGN KEY ("relationship_id") REFERENCES "relationships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "shared_topics"
ADD CONSTRAINT "shared_topics_created_by_user_id_fkey"
FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_messages"
ADD CONSTRAINT "thread_messages_shared_topic_id_fkey"
FOREIGN KEY ("shared_topic_id") REFERENCES "shared_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "thread_messages"
ADD CONSTRAINT "thread_messages_sender_user_id_fkey"
FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
