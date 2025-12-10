'use client';

import { Transaction } from '@/types/transaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { formatAmount, truncateAddress, formatFullDate, calculateFee, copyToClipboard } from '@/lib/utils/format';
import { useToast } from '@/hooks/use-toast';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetails({ transaction, open, onOpenChange }: TransactionDetailsProps) {
  const { toast } = useToast();

  if (!transaction) return null;

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'confirmed':
        return 'confirmed';
      case 'failed':
        return 'failed';
      default:
        return 'default';
    }
  };

  const transactionFee = calculateFee(transaction.gasLimit, transaction.gasPrice);
  const explorerUrl = `https://etherscan.io/tx/${transaction.hash}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View complete information about this transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={getStatusVariant(transaction.status)} className="text-sm">
              {transaction.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Transaction Hash</span>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <span className="font-mono text-sm flex-1 break-all">{transaction.hash}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => handleCopy(transaction.hash, 'Transaction hash')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">From Address</span>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <span className="font-mono text-sm flex-1 break-all">{transaction.fromAddress}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => handleCopy(transaction.fromAddress, 'From address')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">To Address</span>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <span className="font-mono text-sm flex-1 break-all">{transaction.toAddress}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => handleCopy(transaction.toAddress, 'To address')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Amount</span>
            <span className="text-lg font-semibold">{formatAmount(transaction.amount)}</span>
          </div>

          {transaction.gasLimit && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gas Limit</span>
              <span className="text-sm font-mono">{transaction.gasLimit}</span>
            </div>
          )}

          {transaction.gasPrice && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gas Price</span>
              <span className="text-sm font-mono">{transaction.gasPrice} ETH</span>
            </div>
          )}

          {(transaction.gasLimit || transaction.gasPrice) && (
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium">Transaction Fee</span>
              <span className="text-lg font-semibold">{transactionFee}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Timestamp</span>
            <span className="text-sm">{formatFullDate(transaction.timestamp || transaction.createdAt)}</span>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(explorerUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

