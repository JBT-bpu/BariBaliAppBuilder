import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'chip';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export function LoadingSkeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    count = 1,
}: LoadingSkeletonProps) {
    const baseClasses = 'relative overflow-hidden rounded';

    const variantClasses = {
        text: 'h-4',
        circular: 'rounded-full',
        rectangular: '',
        chip: 'h-11 rounded-lg',
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const skeletonClass = cn(
        baseClasses,
        variantClasses[variant],
        className
    );

    const SkeletonItem = () => (
        <div className={skeletonClass} style={style}>
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Premium glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm dark:bg-black/10" />
        </div>
    );

    if (count === 1) {
        return <SkeletonItem />;
    }

    return (
        <div className="space-y-2">
            {Array.from({ length: count }, (_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                    <SkeletonItem />
                </motion.div>
            ))}
        </div>
    );
}

// Specialized loading components
export function ChipSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: count }, (_, i) => (
                <LoadingSkeleton key={i} variant="chip" width={80 + Math.random() * 40} />
            ))}
        </div>
    );
}

export function BowlSkeleton() {
    return (
        <div className="flex flex-col items-center space-y-4">
            <LoadingSkeleton variant="circular" width={200} height={200} />
            <div className="w-full max-w-md space-y-2">
                <LoadingSkeleton variant="text" width="60%" />
                <LoadingSkeleton variant="text" width="40%" />
            </div>
        </div>
    );
}

export function NutritionMeterSkeleton() {
    return (
        <div className="space-y-3">
            <LoadingSkeleton variant="rectangular" height={120} />
            <div className="flex justify-between">
                <LoadingSkeleton variant="text" width={60} />
                <LoadingSkeleton variant="text" width={60} />
                <LoadingSkeleton variant="text" width={60} />
            </div>
        </div>
    );
}

export function IngredientSheetSkeleton() {
    return (
        <div className="space-y-4 p-4">
            <LoadingSkeleton variant="text" width="40%" height={20} />
            <ChipSkeleton count={6} />
            <ChipSkeleton count={4} />
            <ChipSkeleton count={5} />
        </div>
    );
}
