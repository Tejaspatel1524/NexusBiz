import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none border';

    const variants = {
        primary: 'bg-blue text-white border-blue hover:bg-blue-accent hover:border-blue-accent',
        secondary: 'bg-white text-black border-white hover:bg-gray-100 hover:border-gray-100',
        outline: 'bg-transparent text-white border-white hover:bg-white hover:text-black',
        ghost: 'bg-transparent text-gray-200 border-transparent hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
export { cn };
