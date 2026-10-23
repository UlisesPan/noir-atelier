import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1792739916697 implements MigrationInterface {
    name = 'InitialSchema1792739916697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(60) NOT NULL, "slug" character varying(80) NOT NULL, "description" text NOT NULL DEFAULT '', CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_gender_enum" AS ENUM('masculine', 'feminine', 'unisex')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(120) NOT NULL, "slug" character varying(140) NOT NULL, "description" text NOT NULL, "notes" jsonb NOT NULL DEFAULT '{"top":[],"heart":[],"base":[]}', "price" numeric(12,2) NOT NULL, "compareAtPrice" numeric(12,2), "stock" integer NOT NULL DEFAULT '0', "volumeMl" integer NOT NULL DEFAULT '100', "gender" "public"."products_gender_enum" NOT NULL DEFAULT 'unisex', "image" character varying NOT NULL, "featured" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "ratingAvg" numeric(3,2) NOT NULL DEFAULT '0', "ratingCount" integer NOT NULL DEFAULT '0', "categoryId" integer NOT NULL, CONSTRAINT "CHK_4f89fdb25537b37409d3b781c8" CHECK ("price" >= 0), CONSTRAINT "CHK_aea3ee263e1d44e36e5f5b5783" CHECK ("stock" >= 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_464f927ae360106b783ed0b410" ON "products" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff56834e735fa78a15d0cf2192" ON "products" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer, "productName" character varying(120) NOT NULL, "productImage" character varying NOT NULL, "unitPrice" numeric(12,2) NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "total" numeric(12,2) NOT NULL, "shippingAddress" character varying(160) NOT NULL, "paymentId" character varying, "paymentPreferenceId" character varying, "paidAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_151b79a83ba240b0cb31b2302d" ON "orders" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(80) NOT NULL, "email" character varying(120) NOT NULL, "passwordHash" character varying NOT NULL, "address" character varying(160) NOT NULL, "phone" character varying(30) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist_items" ("userId" integer NOT NULL, "productId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d461b3ed3990144aa6d5c45083b" PRIMARY KEY ("userId", "productId"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "rating" smallint NOT NULL, "comment" text NOT NULL DEFAULT '', "userId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "UQ_9007ffba411fd471dfe233dabfb" UNIQUE ("userId", "productId"), CONSTRAINT "CHK_2ea381a5c2f8bef0073a48f6bd" CHECK ("rating" BETWEEN 1 AND 5), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a6b3c434392f5d10ec17104366" ON "reviews" ("productId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_3167e7490f12ed329a36703d980" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_485ece8ab9b569d1c560144aa25" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_485ece8ab9b569d1c560144aa25"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_3167e7490f12ed329a36703d980"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6b3c434392f5d10ec17104366"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "wishlist_items"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_151b79a83ba240b0cb31b2302d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff56834e735fa78a15d0cf2192"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_464f927ae360106b783ed0b410"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_gender_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
