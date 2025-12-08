import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document & {
  createdAt: Date;
  updatedAt: Date;
};

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, unique: true })
  hash: string;

  @Prop({ required: true })
  fromAddress: string;

  @Prop({ required: true })
  toAddress: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ 
    type: String, 
    enum: TransactionStatus, 
    default: TransactionStatus.PENDING 
  })
  status: TransactionStatus;

  @Prop({ required: false })
  gasLimit?: string;

  @Prop({ required: false })
  gasPrice?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Create index for faster queries
TransactionSchema.index({ hash: 1 });
TransactionSchema.index({ createdAt: -1 });

