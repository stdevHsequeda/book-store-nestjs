import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixDetails1595970826135 implements MigrationInterface {
  name = 'fixDetails1595970826135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "lastName" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "lastName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
