'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PremiumParallaxBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function PremiumParallaxBackground({
    children,
    className
}: PremiumParallaxBackgroundProps) {
    const pathname = usePathname();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [blurAmount, setBlurAmount] = useState(0);
    const [overlayOpacity, setOverlayOpacity] = useState(0.3);
    const [brightness, setBrightness] = useState(1);

    // Calculate scroll progress based on current route
    useEffect(() => {
        let progress = 0;
        let blur = 0;
        let overlay = 0.3;
        let bright = 1;

        if (pathname.includes('interactive-builder')) {
            progress = 0;
            blur = 0;
            overlay = 0.35;
            bright = 0.95;
        } else if (pathname.includes('size-selector')) {
            progress = 15;
            blur = 2;
            overlay = 0.32;
            bright = 0.97;
        } else if (pathname.includes('slot')) {
            progress = 33;
            blur = 4;
            overlay = 0.3;
            bright = 1;
        } else if (pathname.includes('order') && pathname.includes('success')) {
            progress = 100;
            blur = 8;
            overlay = 0.25;
            bright = 1.05;
        }

        setScrollProgress(progress);
        setBlurAmount(blur);
        setOverlayOpacity(overlay);
        setBrightness(bright);
    }, [pathname]);

    // Calculate background position (horizontal scroll)
    const backgroundPosition = `${-scrollProgress * 2}% 0%`;

    return (
        <div className={cn('relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50', className)}>
            {/* Background Layer with Parallax */}
            <motion.div
                className="fixed inset-0 z-0 w-full h-full"
                initial={{ backgroundPosition: '0% 0%' }}
                animate={{ backgroundPosition }}
                transition={{
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1], // cubic-bezier for premium feel
                }}
                style={{
                    backgroundImage: 'url(/graphics/bg-main.png)',
                    backgroundSize: '200% 100%',
                    backgroundPosition,
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    filter: `blur(${blurAmount}px) brightness(${brightness})`,
                    willChange: 'background-position',
                }}
            />

            {/* Gradient Overlay */}
            <motion.div
                className="fixed inset-0 z-1 pointer-events-none"
                animate={{ opacity: overlayOpacity }}
                transition={{ duration: 0.8 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
                }}
            />

            {/* Glow/Shine Effect */}
            <motion.div
                className="fixed inset-0 z-2 pointer-events-none"
                animate={{
                    opacity: [0, 0.3, 0],
                    backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                }}
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                }}
            />

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 z-50"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
