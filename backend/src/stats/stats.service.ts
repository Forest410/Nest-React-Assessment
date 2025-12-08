import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument, TransactionStatus } from '../transactions/schemas/transaction.schema';

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) { }

    async getStats() {
        const total = await this.transactionModel.countDocuments().exec();
        const confirmed = await this.transactionModel.countDocuments({ status: TransactionStatus.CONFIRMED }).exec();
        const pending = await this.transactionModel.countDocuments({ status: TransactionStatus.PENDING }).exec();
        const failed = await this.transactionModel.countDocuments({ status: TransactionStatus.FAILED }).exec();

        const transactions = await this.transactionModel.find().exec();
        const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);
        const averageAmount = total > 0 ? totalVolume / total : 0;
        const successRate = total > 0 ? (confirmed / total) * 100 : 0;

        return {
            success: true,
            data: {
                totalTransactions: total,
                totalVolume: totalVolume.toFixed(8),
                averageAmount: averageAmount.toFixed(8),
                successRate: successRate.toFixed(2),
                pendingCount: pending,
                confirmedCount: confirmed,
                failedCount: failed,
            },
        };
    }
}

