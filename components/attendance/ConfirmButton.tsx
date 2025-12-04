'use client';

import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ConfirmButtonProps {
  status: 'confirmed' | 'declined' | null;
  onConfirm: () => void;
  onDecline: () => void;
  loading?: boolean;
  size?: 'default' | 'lg';
}

export function ConfirmButton({
  status,
  onConfirm,
  onDecline,
  loading,
  size = 'default'
}: ConfirmButtonProps) {
  if (loading) {
    return (
      <div className="flex gap-2">
        <Button disabled size={size} variant="outline">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size={size}
        variant={status === 'confirmed' ? 'default' : 'outline'}
        onClick={onConfirm}
        className={cn(
          'min-w-[80px]',
          status === 'confirmed' && 'bg-green-600 hover:bg-green-700'
        )}
      >
        <Check className="h-4 w-4 mr-1" />
        Going
      </Button>
      <Button
        size={size}
        variant={status === 'declined' ? 'default' : 'outline'}
        onClick={onDecline}
        className={cn(
          'min-w-[80px]',
          status === 'declined' && 'bg-red-600 hover:bg-red-700'
        )}
      >
        <X className="h-4 w-4 mr-1" />
        Not Going
      </Button>
    </div>
  );
}
