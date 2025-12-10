'use client';

import { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionStatus, SortField, SortDirection } from '@/types/transaction';
import { formatAmount, truncateAddress, formatTimestamp } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/lib/utils/format';
import { InlineFilters } from './InlineFilters';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onTransactionClick: (transaction: Transaction) => void;
  selectedStatuses: TransactionStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
  onStatusChange: (statuses: TransactionStatus[]) => void;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  onClear: () => void;
}

export function TransactionList({
  transactions,
  loading,
  onTransactionClick,
  selectedStatuses,
  dateFrom,
  dateTo,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClear,
}: TransactionListProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const { toast } = useToast();

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp || a.createdAt || '').getTime();
          bValue = new Date(b.timestamp || b.createdAt || '').getTime();
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [transactions, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when transactions or itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length, itemsPerPage]);

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    }
  };

  const getStatusVariant = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return 'pending';
      case TransactionStatus.CONFIRMED:
        return 'confirmed';
      case TransactionStatus.FAILED:
        return 'failed';
      default:
        return 'default';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedTransactions.length)} of{' '}
            {sortedTransactions.length} transaction{sortedTransactions.length !== 1 ? 's' : ''}
          </div>
          <InlineFilters
            selectedStatuses={selectedStatuses}
            dateFrom={dateFrom}
            dateTo={dateTo}
            transactions={sortedTransactions}
            onStatusChange={onStatusChange}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            onClear={onClear}
          />
        </CardHeader>
        <CardContent className="p-0">
          {sortedTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('amount')}>
                      <div className="flex items-center justify-end">
                        Amount
                        {getSortIcon('amount')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('timestamp')}>
                      <div className="flex items-center">
                        Timestamp
                        {getSortIcon('timestamp')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id || transaction._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onTransactionClick(transaction)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {truncateAddress(transaction.hash)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(transaction.hash, 'Transaction hash');
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {truncateAddress(transaction.fromAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(transaction.fromAddress, 'From address');
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {truncateAddress(transaction.toAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(transaction.toAddress, 'To address');
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatAmount(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatTimestamp(transaction.timestamp || transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-muted-foreground whitespace-nowrap">
              Items per page:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
