/* Format transaction amount with proper decimals and symbol */
export function formatAmount(amount: string, symbol: string = 'ETH'): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0 ${symbol}';
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${symbol}`;
}

/* Truncate Ethereum address (show first 6 and last 4 chars) */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/* Format timestamp to readable format */
export function formatTimestamp(timestamp: string | Date | undefined): string {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();                                    // milliseconds
  const diffMins = Math.floor(diffMs / (60 * 1000));                               // minutes
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));                         // hours
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));                     // days

  if (diffMins < 1) return 'Just now';                                            // less than 1 minute
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;    // less than 1 hour
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;    // less than 1 day
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;        // less than 1 week

  /* Format as date */
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/* Format full date and time */
export function formatFullDate(timestamp: string | Date | undefined): string {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* Calculate transaction fee */
export function calculateFee(gasLimit?: string, gasPrice?: string, symbol: string = 'ETH'): string {
  if (!gasLimit || !gasPrice) return '0 ' + symbol;
  const limit = parseFloat(gasLimit);
  const price = parseFloat(gasPrice);
  if (isNaN(limit) || isNaN(price)) return '0 ' + symbol;
  const fee = limit * price;
  return formatAmount(fee.toString(), symbol);
} 

/* Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/* Validate Ethereum address checksum according to EIP-55 */
function isValidChecksumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/* Get detailed validation error message for Ethereum address */
export function getEthereumAddressError(address: string): string | null {
  if (!address || typeof address !== 'string') {
    return 'Address is required';
  }

  const trimmed = address.trim();

  if (trimmed.length === 0) {
    return 'Address is required';
  }

  if (!trimmed.startsWith('0x')) {
    return 'Address must start with 0x';
  }

  if (trimmed.length < 42) {
    return 'Address is too short. Must be 42 characters (0x + 40 hex characters)';
  }

  if (trimmed.length > 42) {
    return 'Address is too long. Must be 42 characters (0x + 40 hex characters)';
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return 'Address contains invalid characters. Must be hexadecimal (0-9, a-f, A-F)';
  }

  // Check checksum if uppercase letters are present
  if (/[A-F]/.test(trimmed) && !isValidChecksumAddress(trimmed)) {
    return 'Invalid checksum. Please use a valid checksummed address or lowercase address';
  }

  return null;
}

