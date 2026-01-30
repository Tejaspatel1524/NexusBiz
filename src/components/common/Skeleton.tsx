import React from 'react';
import { cn } from './Button';

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={cn('bg-gray-400 animate-pulse', className)} />
    );
};

export default Skeleton;
