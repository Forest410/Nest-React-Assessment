import { IsNotEmpty, IsString, IsOptional, Matches, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^0x[a-fA-F0-9]{40}$/, {
        message: 'toAddress must be a valid Ethereum address',
    })
    toAddress: string;

    @IsString()
    @IsNotEmpty()
    amount: string;

    @IsOptional()
    @IsString()
    gasLimit?: string;

    @IsOptional()
    @IsString()
    gasPrice?: string;
}

