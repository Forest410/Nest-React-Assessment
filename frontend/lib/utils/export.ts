import * as XLSX from 'xlsx';
import { Transaction } from '@/types/transaction';
import { formatFullDate, formatAmount, calculateFee } from './format';

/* Export transactions to XLSX file */
export function exportTransactionsToXLSX(transactions: Transaction[], filename: string = 'transactions.xlsx') {
  const exportData = transactions.map((tx) => ({
    'Transaction Hash': tx.hash,
    'From Address': tx.fromAddress,
    'To Address': tx.toAddress,
    'Amount (ETH)': parseFloat(tx.amount).toFixed(6),
    'Status': tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
    'Gas Limit': tx.gasLimit || 'N/A',
    'Gas Price (ETH)': tx.gasPrice || 'N/A',
    'Transaction Fee (ETH)': tx.gasLimit && tx.gasPrice 
      ? (parseFloat(tx.gasLimit) * parseFloat(tx.gasPrice)).toFixed(8)
      : '0',
    'Timestamp': formatFullDate(tx.timestamp || tx.createdAt),
    'Date': tx.timestamp || tx.createdAt || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  const columnWidths = [
    { wch: 20 }, // Transaction Hash
    { wch: 42 }, // From Address
    { wch: 42 }, // To Address
    { wch: 15 }, // Amount
    { wch: 12 }, // Status
    { wch: 12 }, // Gas Limit
    { wch: 18 }, // Gas Price
    { wch: 18 }, // Transaction Fee
    { wch: 20 }, // Timestamp
    { wch: 25 }, // Date
  ];
  worksheet['!cols'] = columnWidths;

  // Write file
  XLSX.writeFile(workbook, filename);
}

