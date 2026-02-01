import React from 'react';
import { cn } from './Button';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "skeleton-pulse rounded w-full",
                        className
                    )}
                />
            ))}
        </>
    );
};

export const PlanSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 page-fade-in">
            {/* Title Skeleton */}
            <Skeleton className="h-12 w-2/3 mb-10" />

            {/* Sections Skeleton */}
            <div className="space-y-6">
                <div className="glass p-8 rounded-lg space-y-4">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-full" count={3} />
                </div>

                <div className="glass p-8 rounded-lg space-y-4">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                    </div>
                </div>

                <div className="glass p-8 rounded-lg space-y-4">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" count={4} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
