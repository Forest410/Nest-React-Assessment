'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { transactionsAPI } from '@/lib/api';
import { getEthereumAddressError, calculateFee } from '@/lib/utils/format';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  toAddress: z
    .string()
    .min(1, 'To address is required')
    .trim()
    .refine((val) => {
      const error = getEthereumAddressError(val);
      return error === null;
    }, (val) => {
      const error = getEthereumAddressError(val);
      return { message: error || 'Must be a valid Ethereum address' };
    }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, {
      message: 'Amount must be a positive number',
    }),
  gasLimit: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
      message: 'Gas limit must be a positive number',
    }),
  gasPrice: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
      message: 'Gas price must be a positive number',
    }),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const STORAGE_KEY = 'transaction-form-draft';

export function CreateTransactionForm({ open, onOpenChange, onSuccess }: CreateTransactionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      toAddress: '',
      amount: '',
      gasLimit: '21000',
      gasPrice: '0.00000002',
    },
  });

  const gasLimit = watch('gasLimit', '21000');
  const gasPrice = watch('gasPrice', '0.00000002');
  const toAddress = watch('toAddress', '');
  const transactionFee = calculateFee(gasLimit, gasPrice);

  // Real-time validation handler
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('toAddress', value, { shouldValidate: true });
    await trigger('toAddress');
  };

  // Handler to allow only numeric input (no negative numbers)
  const handleNumericInput = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'amount' | 'gasLimit' | 'gasPrice') => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    value = value.replace(/-/g, '');

    setValue(fieldName, value, { shouldValidate: true });
    await trigger(fieldName);
  };

  // Load draft from localStorage
  useEffect(() => {
    if (open) {
      try {
        const draft = localStorage.getItem(STORAGE_KEY);
        if (draft) {
          const parsed = JSON.parse(draft);
          setValue('toAddress', parsed.toAddress || '');
          setValue('amount', parsed.amount || '');
          setValue('gasLimit', parsed.gasLimit || '21000');
          setValue('gasPrice', parsed.gasPrice || '0.00000002');
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [open, setValue]);

  // Save draft to localStorage on change
  useEffect(() => {
    if (open) {
      const subscription = watch((value) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [open, watch]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await transactionsAPI.create({
        toAddress: data.toAddress,
        amount: data.amount,
        gasLimit: data.gasLimit,
        gasPrice: data.gasPrice,
      });

      localStorage.removeItem(STORAGE_KEY);

      reset();

      const transaction = response.data.data;
      toast({
        title: 'Transaction Created!',
        description: `Transaction hash: ${transaction.hash}`,
      });

      onOpenChange(false);

      onSuccess();
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create transaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>
            Send a new blockchain transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="toAddress">
              To Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="toAddress"
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                {...register('toAddress', {
                  onChange: handleAddressChange,
                })}
                className={errors.toAddress ? 'border-destructive' : toAddress && !errors.toAddress ? 'border-green-500' : ''}
                onBlur={(e) => {
                  const trimmed = e.target.value.trim();
                  if (trimmed !== e.target.value) {
                    setValue('toAddress', trimmed, { shouldValidate: true });
                  }
                }}
              />
              {toAddress && !errors.toAddress && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-sm">
                  ✓
                </span>
              )}
            </div>
            {errors.toAddress && (
              <p className="text-sm text-destructive">{errors.toAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount (ETH) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="1.5"
              {...register('amount', {
                onChange: (e) => handleNumericInput(e, 'amount'),
              })}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gasLimit">Gas Limit (optional)</Label>
            <Input
              id="gasLimit"
              type="text"
              inputMode="numeric"
              placeholder="21000"
              {...register('gasLimit', {
                onChange: (e) => handleNumericInput(e, 'gasLimit'),
              })}
              className={errors.gasLimit ? 'border-destructive' : ''}
            />
            {errors.gasLimit && (
              <p className="text-sm text-destructive">{errors.gasLimit.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Default: 21000</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gasPrice">Gas Price (ETH) (optional)</Label>
            <Input
              id="gasPrice"
              type="text"
              inputMode="decimal"
              placeholder="0.00000002"
              {...register('gasPrice', {
                onChange: (e) => handleNumericInput(e, 'gasPrice'),
              })}
              className={errors.gasPrice ? 'border-destructive' : ''}
            />
            {errors.gasPrice && (
              <p className="text-sm text-destructive">{errors.gasPrice.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Default: 0.00000002 ETH</p>
          </div>

          <div className="rounded-lg border bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated Transaction Fee</span>
              <span className="text-lg font-semibold">{transactionFee}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculated as: Gas Limit × Gas Price
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Transaction'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

