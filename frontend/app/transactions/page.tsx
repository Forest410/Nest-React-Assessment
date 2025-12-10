'use client';

import { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { transactionsAPI } from '@/lib/api';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionDetails } from '@/components/transactions/TransactionDetails';
import { CreateTransactionForm } from '@/components/transactions/CreateTransactionForm';
import { SearchBar } from '@/components/transactions/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  
  // Filter and search state
  const [selectedStatuses, setSelectedStatuses] = useState<TransactionStatus[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsAPI.getAll();
      const data = response.data.data;
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.response?.data?.message || 'Failed to load transactions');
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Apply filters and search
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Status filter (multi-select)
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(tx => selectedStatuses.includes(tx.status));
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp || tx.createdAt || '');
        return txDate >= dateFrom;
      });
    }
    if (dateTo) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp || tx.createdAt || '');
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        return txDate <= toDate;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(query) ||
        tx.fromAddress.toLowerCase().includes(query) ||
        tx.toAddress.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, selectedStatuses, dateFrom, dateTo, searchQuery]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const handleCreateSuccess = () => {
    loadTransactions();
  };

  const handleRetry = () => {
    loadTransactions();
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setDateFrom(null);
    setDateTo(null);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your blockchain transactions
          </p>
        </div>
        <Button 
          onClick={() => setCreateFormOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Transaction</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Error State */}
      {error && !loading && (
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Error loading transactions</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleRetry} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      {!error && (
        <Card className="w-full">
          <CardContent className="pt-6">
            <SearchBar onSearchChange={setSearchQuery} />
          </CardContent>
        </Card>
      )}

      {/* Transaction List with Filters */}
      {!error && (
        <TransactionList
          transactions={filteredTransactions}
          loading={loading}
          onTransactionClick={handleTransactionClick}
          selectedStatuses={selectedStatuses}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onStatusChange={setSelectedStatuses}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClear={handleClearFilters}
        />
      )}

      {/* Transaction Details Modal */}
      <TransactionDetails
        transaction={selectedTransaction}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Create Transaction Form */}
      <CreateTransactionForm
        open={createFormOpen}
        onOpenChange={setCreateFormOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
