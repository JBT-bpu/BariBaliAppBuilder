'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSaladStore } from '@/lib/store';
import { getNutritionTarget } from '@/lib/nutrition';
import { cn } from '@/lib/utils';

interface BowlCanvasProps {
    className?: string;
}

export const BowlCanvas = React.memo(function BowlCanvas({ className }: BowlCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    const {
        size,
        ingredients,
        sauces,
        nutritionTotal,
        nutritionBadges,
    } = useSaladStore();

    const target = size ? getNutritionTarget(size) : getNutritionTarget('1000');
    const kcalProgress = Math.min((nutritionTotal.kcal / target.kcal) * 100, 100);

    // Animation state
    const [displayKcal, setDisplayKcal] = React.useState(nutritionTotal.kcal);
    const [isPulsing, setIsPulsing] = React.useState(false);

    // Animate kcal number changes
    useEffect(() => {
        const startValue = displayKcal;
        const endValue = nutritionTotal.kcal;
        const duration = 500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setDisplayKcal(Math.round(currentValue));

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        if (startValue !== endValue) {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 200);
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [nutritionTotal.kcal, displayKcal]);

    // Draw the bowl canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw outer kcal donut ring
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FFD93B');
        gradient.addColorStop(1, '#5AC568');

        // Background ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(10, 61, 46, 0.1)';
        ctx.stroke();

        // Progress ring
        const progressAngle = (kcalProgress / 100) * 2 * Math.PI - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle);
        ctx.lineWidth = 8;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw inner content with proper scaling
        ctx.fillStyle = '#0A3D2E';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayKcal.toString(), centerX, centerY - 8);

        ctx.fillStyle = '#0A3D2E';
        ctx.font = '16px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillText(`/${target.kcal}`, centerX, centerY + 12);

    }, [displayKcal, kcalProgress, target.kcal]);

    const totalItems = ingredients.length + sauces.length;

    return (
        <div className={cn('relative', className)}>
            {/* Main bowl canvas */}
            <div className={cn(
                'relative mx-auto bg-gradient-to-br from-green/10 to-lemon/10 rounded-full',
                'transition-transform duration-200',
                isPulsing && 'scale-105'
            )} style={{ width: 'clamp(140px, 40vw, 180px)', height: 'clamp(140px, 40vw, 180px)' }}>
                <canvas
                    ref={canvasRef}
                    width={180}
                    height={180}
                    className="absolute inset-0 rounded-full"
                />
            </div>

            {/* Tri-bars below bowl */}
            <div className="mt-2 sm:mt-4 space-y-0.5 sm:space-y-1">
                {/* Protein bar */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0">חלבון</span>
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min((nutritionTotal.protein / 30) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0 text-right">{Math.round(nutritionTotal.protein)}g</span>
                </div>

                {/* Carbs bar */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0">פחמימות</span>
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${Math.min((nutritionTotal.carbs / 50) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0 text-right">{Math.round(nutritionTotal.carbs)}g</span>
                </div>

                {/* Fat bar */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0">שומנים</span>
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{ width: `${Math.min((nutritionTotal.fat / 25) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] sm:text-xs text-ink w-6 sm:w-8 flex-shrink-0 text-right">{Math.round(nutritionTotal.fat)}g</span>
                </div>
            </div>

        </div>
    );
});
