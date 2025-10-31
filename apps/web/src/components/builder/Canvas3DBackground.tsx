'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Canvas3DBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function Canvas3DBackground({
    children,
    className
}: Canvas3DBackgroundProps) {
    const pathname = usePathname();
    const [pageState, setPageState] = useState<'builder' | 'size' | 'slot' | 'success'>('builder');
    const [progress, setProgress] = useState(0);
    const [canvasOffsetY, setCanvasOffsetY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simulate loading completion
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Determine page state and progress
    useEffect(() => {
        if (pathname.includes('interactive-builder')) {
            setPageState('builder');
            setProgress(0);
            setCanvasOffsetY(0);
        } else if (pathname.includes('size-selector')) {
            setPageState('size');
            setProgress(33);
            setCanvasOffsetY(0);
        } else if (pathname.includes('slot')) {
            setPageState('slot');
            setProgress(66);
            setCanvasOffsetY(0);
        } else if (pathname.includes('success')) {
            setPageState('success');
            setProgress(100);
            setCanvasOffsetY(1200);
        }
        setIsLoading(false);
    }, [pathname]);

    // Modern color schemes with enhanced gradients
    const colorSchemes = {
        builder: {
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
            primary: '#10B981',
            secondary: '#34D399',
            accent: '#6EE7B7',
            gradient1: 'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.2) 30%, transparent 60%)',
            gradient2: 'radial-gradient(circle at 80% 70%, rgba(52, 211, 153, 0.4) 0%, rgba(52, 211, 153, 0.1) 35%, transparent 65%)',
            gradient3: 'radial-gradient(circle at 50% 50%, rgba(110, 231, 183, 0.3) 0%, rgba(110, 231, 183, 0.05) 40%, transparent 70%)',
        },
        size: {
            bg: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f0f9ff 100%)',
            primary: '#059669',
            secondary: '#10B981',
            accent: '#34D399',
            gradient1: 'radial-gradient(circle at 20% 30%, rgba(5, 150, 105, 0.5) 0%, rgba(5, 150, 105, 0.2) 30%, transparent 60%)',
            gradient2: 'radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.1) 35%, transparent 65%)',
            gradient3: 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0.05) 40%, transparent 70%)',
        },
        slot: {
            bg: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 50%, #f0f9ff 100%)',
            primary: '#0891B2',
            secondary: '#06B6D4',
            accent: '#22D3EE',
            gradient1: 'radial-gradient(circle at 20% 30%, rgba(8, 145, 178, 0.5) 0%, rgba(8, 145, 178, 0.2) 30%, transparent 60%)',
            gradient2: 'radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.1) 35%, transparent 65%)',
            gradient3: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.05) 40%, transparent 70%)',
        },
        success: {
            bg: 'linear-gradient(135deg, #fef3c7 0%, #fef08a 50%, #fef9e7 100%)',
            primary: '#F59E0B',
            secondary: '#FBBF24',
            accent: '#FCD34D',
            gradient1: 'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.5) 0%, rgba(245, 158, 11, 0.2) 30%, transparent 60%)',
            gradient2: 'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.1) 35%, transparent 65%)',
            gradient3: 'radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.3) 0%, rgba(252, 211, 77, 0.05) 40%, transparent 70%)',
        },
    };

    const currentColors = colorSchemes[pageState];

    return (
        <div className={cn('relative min-h-screen overflow-hidden', className)} style={{ background: currentColors.bg }}>
            {/* Loading Screen for Mobile */}
            {isLoading && isMobile && (
                <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 text-4xl">🥗</div>
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-green-600 font-semibold">Loading...</p>
                    </div>
                </div>
            )}

            {/* 3D Canvas Container - Simplified for Mobile */}
            <motion.div
                className="fixed inset-0 z-0"
                animate={{
                    y: isMobile ? 0 : -canvasOffsetY,
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                    width: '100%',
                    height: isMobile ? '100vh' : '2400px',
                    perspective: '1000px',
                }}
            >
                {/* Base gradient background */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: currentColors.bg,
                        backgroundSize: isMobile ? '100% 100%' : '100% 600px',
                        backgroundRepeat: isMobile ? 'no-repeat' : 'repeat-y',
                    }}
                />

                {/* Animated gradient layer 1 - Primary glow - Disabled on mobile */}
                {!isMobile && (
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            backgroundImage: currentColors.gradient1,
                            backgroundSize: '200% 200%',
                            backgroundPosition: '0% 0%',
                        }}
                    />
                )}

                {/* Animated gradient layer 2 - Secondary glow - Disabled on mobile */}
                {!isMobile && (
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'],
                            opacity: [0.6, 0.9, 0.6],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.5,
                        }}
                        style={{
                            backgroundImage: currentColors.gradient2,
                            backgroundSize: '200% 200%',
                            backgroundPosition: '100% 100%',
                        }}
                    />
                )}

                {/* Animated gradient layer 3 - Accent glow - Disabled on mobile */}
                {!isMobile && (
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['50% 50%', '0% 100%', '50% 50%'],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                        style={{
                            backgroundImage: currentColors.gradient3,
                            backgroundSize: '200% 200%',
                            backgroundPosition: '50% 50%',
                        }}
                    />
                )}

                {/* Premium accent layer - Dynamic color shift - Disabled on mobile */}
                {!isMobile && (
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{
                            backgroundImage: `radial-gradient(circle at 30% 40%, ${currentColors.primary}15 0%, transparent 40%), radial-gradient(circle at 70% 60%, ${currentColors.secondary}10 0%, transparent 50%)`,
                            backgroundSize: '300% 300%',
                            backgroundPosition: '0% 0%',
                        }}
                    />
                )}
            </motion.div>

            {/* Glassmorphism overlay layer - Disabled on mobile */}
            {!isMobile && (
                <motion.div
                    className="fixed inset-0 z-1 pointer-events-none"
                    animate={{
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${currentColors.primary}08 0%, ${currentColors.secondary}05 50%, ${currentColors.accent}08 100%)`,
                        backdropFilter: 'blur(1px)',
                    }}
                />
            )}

            {/* Soft vignette overlay for depth - Disabled on mobile */}
            {!isMobile && (
                <motion.div
                    className="fixed inset-0 z-2 pointer-events-none"
                    animate={{
                        backgroundImage: `radial-gradient(ellipse at 50% 50%, transparent 0%, ${currentColors.primary}08 100%)`,
                    }}
                    transition={{ duration: 1 }}
                />
            )}

            {/* Animated accent glow - Disabled on mobile */}
            {!isMobile && (
                <motion.div
                    className="fixed inset-0 z-1 pointer-events-none"
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        backgroundImage: `radial-gradient(circle at ${50 + progress * 0.3}% 40%, ${currentColors.primary}15 0%, transparent 50%), radial-gradient(circle at ${40 - progress * 0.2}% 60%, ${currentColors.secondary}10 0%, transparent 60%)`,
                    }}
                />
            )}

            {/* Premium Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-1.5 z-50"
                animate={{
                    width: `${progress}%`,
                    background: progress === 0
                        ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                        : progress === 33
                            ? 'linear-gradient(90deg, #059669 0%, #10B981 100%)'
                            : progress === 66
                                ? 'linear-gradient(90deg, #0891B2 0%, #06B6D4 100%)'
                                : 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                    boxShadow: `0 0 30px ${currentColors.primary}60`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
