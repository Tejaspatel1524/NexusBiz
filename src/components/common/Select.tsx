import React from 'react';
import { cn } from './Button';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-200 mb-2">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full bg-gray-400 border border-gray-300 px-4 py-3 text-white focus:outline-none focus:border-blue transition-colors duration-200 appearance-none',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-500">
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
