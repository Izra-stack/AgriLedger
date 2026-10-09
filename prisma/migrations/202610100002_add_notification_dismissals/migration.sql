CREATE TABLE "notification_dismissals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "notification_key" VARCHAR(80) NOT NULL,
    "dismissed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_dismissals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "notification_dismissals_user_id_notification_key_key"
ON "notification_dismissals"("user_id", "notification_key");

CREATE INDEX "notification_dismissals_user_id_idx"
ON "notification_dismissals"("user_id");

ALTER TABLE "notification_dismissals"
ADD CONSTRAINT "notification_dismissals_user_fk"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
