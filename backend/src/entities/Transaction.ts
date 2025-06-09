import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsEnum, IsISO8601, IsNotEmpty, IsPositive } from "class-validator";

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit"
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  @IsPositive()
  value!: number;

  @Column({
    type: "enum",
    enum: TransactionType
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Column({ type: 'date' })
  @IsNotEmpty()
  date!: Date;
}
