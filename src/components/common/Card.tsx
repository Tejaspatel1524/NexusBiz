import React from 'react';
import { cn } from './Button';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, onClick, hover = true }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-gray-500 border border-gray-400 p-6 transition-all duration-300',
                hover && 'hover:border-blue-light hover:translate-y-[-4px]',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;
