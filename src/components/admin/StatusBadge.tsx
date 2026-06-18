'use client';

import { Badge } from '@/components/ui/badge';

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const statusVariants: Record<string, StatusVariant> = {
  published: 'default',
  draft: 'secondary',
  active: 'default',
  inactive: 'secondary',
  unread: 'default',
  read: 'outline',
  archived: 'secondary',
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  return (
    <Badge variant={variant || statusVariants[status.toLowerCase()] || 'secondary'} className={className}>
      {status}
    </Badge>
  );
}
