'use client';

import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, actionLabel, onAction, actionIcon, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {actionLabel && onAction && (
          <Button variant="gold" className="rounded-full" onClick={onAction}>
            {actionIcon || <Plus className="w-4 h-4 mr-2" />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
