import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    Transaction,
    TransactionDocument,
    TransactionStatus,
} from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async count(): Promise<number> {
    return this.transactionModel.countDocuments().exec();
  }

    async create(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionDocument> {
        // Generate a mock transaction hash (in real app, this would come from blockchain)
        const hash = `0x${Math.random().toString(16).substr(2, 64)}`;

        // Mock from address (in real app, this would be the user's wallet address)
        const fromAddress = `0x${Math.random().toString(16).substr(2, 40)}`;

        const transaction = new this.transactionModel({
            ...createTransactionDto,
            hash,
            fromAddress,
            status: TransactionStatus.PENDING,
        });

        const saved = await transaction.save();

        // Simulate async confirmation (in real app, this would be a blockchain event)
        setTimeout(async () => {
            const tx = await this.transactionModel.findById(saved._id).exec();
            if (tx) {
                tx.status =
                    Math.random() > 0.1
                        ? TransactionStatus.CONFIRMED
                        : TransactionStatus.FAILED;
                await tx.save();
            }
        }, 2000);

        return saved;
    }

    async findAll(): Promise<TransactionDocument[]> {
        return this.transactionModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string): Promise<TransactionDocument> {
        const transaction = await this.transactionModel
            .findById(id)
            .exec();

        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }

        return transaction;
    }
}

