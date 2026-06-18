'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#C8A97E] text-white hover:bg-[#B89A6E] shadow-lg shadow-[#C8A97E]/25',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border-2 border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white',
        secondary: 'bg-[#111827] text-white hover:bg-[#1f2937]',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-[#C8A97E] underline-offset-4 hover:underline',
        gold: 'bg-gradient-to-r from-[#C8A97E] to-[#8B7355] text-white hover:opacity-90 shadow-lg',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
