import {
    Controller,
    Get,
    Post,
    Body,
    Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDocument } from './schemas/transaction.schema';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        const transaction = await this.transactionsService.create(createTransactionDto);
        return {
            success: true,
            data: this.formatTransaction(transaction),
        };
    }

    @Get()
    async findAll() {
        const transactions = await this.transactionsService.findAll();
        return {
            success: true,
            data: transactions.map((tx) => this.formatTransaction(tx)),
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const transaction = await this.transactionsService.findOne(id);
        return {
            success: true,
            data: this.formatTransaction(transaction),
        };
    }

    private formatTransaction(transaction: TransactionDocument) {
        return {
            id: transaction._id.toString(),
            hash: transaction.hash,
            fromAddress: transaction.fromAddress,
            toAddress: transaction.toAddress,
            amount: transaction.amount,
            status: transaction.status,
            gasLimit: transaction.gasLimit,
            gasPrice: transaction.gasPrice,
            timestamp: (transaction.createdAt || new Date()).toISOString(),
        };
    }
}
