'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearchChange, placeholder = 'Search by hash or address...' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Call parent callback when debounced search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleClear = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  return (
    <div className="flex-1 relative w-full">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="pr-20 w-full"
      />
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          type="button"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

