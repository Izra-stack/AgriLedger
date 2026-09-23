-- Adds non-destructive archive markers and immutable inventory history.
ALTER TABLE "farmers" ADD COLUMN "archived_at" TIMESTAMPTZ(6);
ALTER TABLE "inventory_items" ADD COLUMN "archived_at" TIMESTAMPTZ(6);
ALTER TABLE "payments" ADD COLUMN "archived_at" TIMESTAMPTZ(6);
ALTER TABLE "transactions" ADD COLUMN "archived_at" TIMESTAMPTZ(6);

CREATE TABLE "transaction_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "transaction_id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transaction_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventory_item_id" UUID NOT NULL,
    "transaction_id" UUID,
    "created_by" UUID NOT NULL,
    "movement_type" VARCHAR(30) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "quantity_before" DECIMAL(12,2) NOT NULL,
    "quantity_after" DECIMAL(12,2) NOT NULL,
    "reference" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "transaction_items_transaction_id_idx" ON "transaction_items"("transaction_id");
CREATE INDEX "transaction_items_inventory_item_id_idx" ON "transaction_items"("inventory_item_id");
CREATE INDEX "inventory_movements_inventory_item_id_created_at_idx" ON "inventory_movements"("inventory_item_id", "created_at");
CREATE INDEX "inventory_movements_transaction_id_idx" ON "inventory_movements"("transaction_id");

ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transaction_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_inventory_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_item_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_transaction_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_user_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
