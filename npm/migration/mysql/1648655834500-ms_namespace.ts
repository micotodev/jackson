import { MigrationInterface, QueryRunner } from "typeorm";

export class msNamespace1648655834500 implements MigrationInterface {
    name = 'msNamespace1648655834500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jackson_store\` ADD \`namespace\` varchar(64) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jackson_store\` DROP COLUMN \`namespace\``);
    }

}