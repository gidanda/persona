ALTER TABLE "profile_interests"
ADD COLUMN "provider" VARCHAR(40),
ADD COLUMN "external_id" VARCHAR(120),
ADD COLUMN "subtitle" VARCHAR(180),
ADD COLUMN "image_url" TEXT,
ADD COLUMN "deeplink_url" TEXT;
