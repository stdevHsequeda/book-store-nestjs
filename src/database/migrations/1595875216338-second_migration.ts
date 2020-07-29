import { MigrationInterface, QueryRunner } from 'typeorm';

export class secondMigration1595875216338 implements MigrationInterface {
  name = 'secondMigration1595875216338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_details" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "lastName" character varying NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'active', "create_at" TIMESTAMP NOT NULL, "update_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(20), "description" text, "status" character varying(8) NOT NULL DEFAULT 'active', "create_at" TIMESTAMP NOT NULL, "update_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_37623035dbbec2f0a4b76ff4000" PRIMARY KEY ("usersId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_deeb1fe94ce2d111a6695a2880" ON "users_roles" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21db462422f1f97519a29041da" ON "users_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "detail_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_9fc134ca20766e165ad650ee740" UNIQUE ("detail_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_9fc134ca20766e165ad650ee740" FOREIGN KEY ("detail_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_21db462422f1f97519a29041da0" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_21db462422f1f97519a29041da0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_9fc134ca20766e165ad650ee740"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_9fc134ca20766e165ad650ee740"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "detail_id"`);
    await queryRunner.query(`DROP INDEX "IDX_21db462422f1f97519a29041da"`);
    await queryRunner.query(`DROP INDEX "IDX_deeb1fe94ce2d111a6695a2880"`);
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "user_details"`);
  }
}
