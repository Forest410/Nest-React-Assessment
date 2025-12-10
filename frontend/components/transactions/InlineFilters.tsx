'use client';

import { TransactionStatus } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, X, ChevronDown, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

import { Transaction } from '@/types/transaction';
import { exportTransactionsToXLSX } from '@/lib/utils/export';

interface InlineFiltersProps {
  selectedStatuses: TransactionStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
  transactions: Transaction[];
  onStatusChange: (statuses: TransactionStatus[]) => void;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  onClear: () => void;
}

const ALL_STATUSES: { value: TransactionStatus; label: string }[] = [
  { value: TransactionStatus.PENDING, label: 'Pending' },
  { value: TransactionStatus.CONFIRMED, label: 'Confirmed' },
  { value: TransactionStatus.FAILED, label: 'Failed' },
];

export function InlineFilters({
  selectedStatuses,
  dateFrom,
  dateTo,
  transactions,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClear,
}: InlineFiltersProps) {
  const hasActiveFilters = selectedStatuses.length > 0 || dateFrom !== null || dateTo !== null;
  const allSelected = selectedStatuses.length === ALL_STATUSES.length;
  const noneSelected = selectedStatuses.length === 0;

  const handleStatusToggle = (status: TransactionStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onStatusChange([]);
    } else {
      onStatusChange(ALL_STATUSES.map(s => s.value));
    }
  };

  const getStatusLabel = () => {
    if (noneSelected) return 'Status';
    if (allSelected) return 'All Status';
    if (selectedStatuses.length === 1) {
      return ALL_STATUSES.find(s => s.value === selectedStatuses[0])?.label || 'Status';
    }
    return `${selectedStatuses.length} Selected`;
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    exportTransactionsToXLSX(transactions, `transactions-${timestamp}.xlsx`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto sm:min-w-[140px] justify-between">
            <span>{getStatusLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[140px] sm:w-[140px] p-3" align="start" sideOffset={4}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <Label
                htmlFor="select-all"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                All Status
              </Label>
            </div>
            <div className="border-t pt-2 space-y-2">
              {ALL_STATUSES.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.value}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <Label
                    htmlFor={status.value}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto flex-1 sm:flex-initial">
            <Calendar className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{dateFrom ? format(dateFrom, 'MMM dd') : 'From'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={dateFrom || undefined}
            onSelect={(date) => onDateFromChange(date || null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto flex-1 sm:flex-initial">
            <Calendar className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{dateTo ? format(dateTo, 'MMM dd') : 'To'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={dateTo || undefined}
            onSelect={(date) => onDateToChange(date || null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClear} 
        className={`h-9 w-full sm:w-auto sm:flex-initial ${hasActiveFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!hasActiveFilters}
      >
        <X className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={transactions.length === 0}
        className="h-9 w-full sm:w-auto"
        title="Export to Excel"
      >
        <Download className="mr-2 h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Export</span>
        <span className="sm:hidden">Export</span>
      </Button>
    </div>
  );
}
