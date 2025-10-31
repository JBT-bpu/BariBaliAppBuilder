'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface AnimatedGenerativeBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedGenerativeBackground({
    children,
    className
}: AnimatedGenerativeBackgroundProps) {
    const pathname = usePathname();
    const [pageState, setPageState] = useState<'builder' | 'size' | 'slot' | 'success'>('builder');
    const [progress, setProgress] = useState(0);

    // Determine page state and progress
    useEffect(() => {
        if (pathname.includes('interactive-builder')) {
            setPageState('builder');
            setProgress(0);
        } else if (pathname.includes('size-selector')) {
            setPageState('size');
            setProgress(33);
        } else if (pathname.includes('slot')) {
            setPageState('slot');
            setProgress(66);
        } else if (pathname.includes('success')) {
            setPageState('success');
            setProgress(100);
        }
    }, [pathname]);

    // Color schemes that progress through the journey
    const colorSchemes = {
        builder: {
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
            primary: '#10B981',
            secondary: '#34D399',
            accent: '#6EE7B7',
            glow: 'rgba(16, 185, 129, 0.3)',
        },
        size: {
            bg: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f0f9ff 100%)',
            primary: '#059669',
            secondary: '#10B981',
            accent: '#34D399',
            glow: 'rgba(5, 150, 105, 0.3)',
        },
        slot: {
            bg: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 50%, #f0f9ff 100%)',
            primary: '#0891B2',
            secondary: '#06B6D4',
            accent: '#22D3EE',
            glow: 'rgba(8, 145, 178, 0.3)',
        },
        success: {
            bg: 'linear-gradient(135deg, #fef3c7 0%, #fef08a 50%, #fef9e7 100%)',
            primary: '#F59E0B',
            secondary: '#FBBF24',
            accent: '#FCD34D',
            glow: 'rgba(245, 158, 11, 0.4)',
        },
    };

    const currentColors = colorSchemes[pageState];

    return (
        <div className={cn('relative min-h-screen overflow-hidden', className)}>
            {/* Animated Background SVG */}
            <svg
                className="fixed inset-0 w-full h-full z-0"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
                style={{ background: currentColors.bg }}
            >
                <defs>
                    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    </filter>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="grad1">
                        <stop offset="0%" stopColor={currentColors.primary} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={currentColors.secondary} stopOpacity="0.1" />
                    </radialGradient>
                    <radialGradient id="grad2">
                        <stop offset="0%" stopColor={currentColors.secondary} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={currentColors.accent} stopOpacity="0.05" />
                    </radialGradient>
                </defs>

                {/* Large animated blobs - Main composition */}
                <motion.circle
                    cx="150"
                    cy="150"
                    r="200"
                    fill="url(#grad1)"
                    filter="url(#blur)"
                    animate={{
                        cx: [150, 200 + progress * 2, 150],
                        cy: [150, 100, 150],
                        r: [200, 250, 200],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.circle
                    cx="1050"
                    cy="200"
                    r="220"
                    fill="url(#grad2)"
                    filter="url(#blur)"
                    animate={{
                        cx: [1050, 1000 - progress * 2, 1050],
                        cy: [200, 280, 200],
                        r: [220, 180, 220],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                />

                <motion.circle
                    cx="200"
                    cy="700"
                    r="210"
                    fill="url(#grad2)"
                    filter="url(#blur)"
                    animate={{
                        cx: [200, 250 + progress, 200],
                        cy: [700, 650, 700],
                        r: [210, 260, 210],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />

                <motion.circle
                    cx="1000"
                    cy="650"
                    r="230"
                    fill="url(#grad1)"
                    filter="url(#blur)"
                    animate={{
                        cx: [1000, 950 - progress, 1000],
                        cy: [650, 720, 650],
                        r: [230, 190, 230],
                    }}
                    transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.5,
                    }}
                />

                {/* Center dynamic blob that grows with progress */}
                <motion.circle
                    cx="600"
                    cy="400"
                    r={100 + progress * 0.5}
                    fill={currentColors.primary}
                    fillOpacity={0.15 + progress * 0.002}
                    filter="url(#blur)"
                    animate={{
                        cx: [600, 620, 600],
                        cy: [400, 380, 400],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </svg>

            {/* Dynamic Radial Glow - Intensifies with progress */}
            <motion.div
                className="fixed inset-0 z-1 pointer-events-none"
                animate={{
                    background: `radial-gradient(circle at 50% 50%, ${currentColors.glow} 0%, transparent ${70 - progress * 0.2}%)`,
                }}
                transition={{ duration: 1 }}
            />

            {/* Floating Icons - More prominent and progress-based */}
            <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
                {/* Builder Stage - Lettuce focus */}
                {(pageState === 'builder' || progress < 33) && (
                    <>
                        <motion.div
                            className="absolute text-8xl"
                            style={{ left: '8%', top: '12%', color: currentColors.primary }}
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                y: [0, -40, 0],
                                x: [0, 15, 0],
                                rotate: [0, 20, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon icon="mdi:leaf" />
                        </motion.div>
                        <motion.div
                            className="absolute text-7xl"
                            style={{ right: '10%', top: '20%', color: currentColors.secondary }}
                            animate={{
                                opacity: [0.2, 0.4, 0.2],
                                y: [0, 30, 0],
                                x: [0, -20, 0],
                                rotate: [0, -25, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                        >
                            <Icon icon="mdi:leaf" />
                        </motion.div>
                    </>
                )}

                {/* Size Stage - Tomato & Carrot */}
                {(pageState === 'size' || (progress >= 33 && progress < 66)) && (
                    <>
                        <motion.div
                            className="absolute text-8xl"
                            style={{ left: '12%', top: '15%', color: currentColors.primary }}
                            animate={{
                                opacity: [0.4, 0.6, 0.4],
                                y: [0, -50, 0],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon icon="mdi:tomato" />
                        </motion.div>
                        <motion.div
                            className="absolute text-7xl"
                            style={{ right: '12%', top: '25%', color: currentColors.secondary }}
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                y: [0, 40, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                        >
                            <Icon icon="mdi:carrot" />
                        </motion.div>
                    </>
                )}

                {/* Slot Stage - Multiple ingredients */}
                {(pageState === 'slot' || (progress >= 66 && progress < 100)) && (
                    <>
                        <motion.div
                            className="absolute text-8xl"
                            style={{ left: '10%', top: '10%', color: currentColors.primary }}
                            animate={{
                                opacity: [0.4, 0.6, 0.4],
                                y: [0, -50, 0],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon icon="mdi:cucumber" />
                        </motion.div>
                        <motion.div
                            className="absolute text-7xl"
                            style={{ right: '15%', top: '15%', color: currentColors.secondary }}
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                y: [0, 40, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                        >
                            <Icon icon="mdi:bell-outline" />
                        </motion.div>
                        <motion.div
                            className="absolute text-6xl"
                            style={{ left: '15%', bottom: '15%', color: currentColors.accent }}
                            animate={{
                                opacity: [0.25, 0.45, 0.25],
                                y: [0, -30, 0],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1,
                            }}
                        >
                            <Icon icon="mdi:carrot" />
                        </motion.div>
                    </>
                )}

                {/* Success Stage - Celebration with all ingredients */}
                {pageState === 'success' && (
                    <>
                        <motion.div
                            className="absolute text-9xl"
                            style={{ left: '8%', top: '8%', color: currentColors.primary }}
                            animate={{
                                opacity: [0.5, 0.8, 0.5],
                                y: [0, -60, 0],
                                scale: [1, 1.4, 1],
                                rotate: [0, 30, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon icon="mdi:leaf" />
                        </motion.div>
                        <motion.div
                            className="absolute text-8xl"
                            style={{ right: '10%', top: '12%', color: currentColors.secondary }}
                            animate={{
                                opacity: [0.4, 0.7, 0.4],
                                y: [0, 50, 0],
                                scale: [1, 1.3, 1],
                                rotate: [0, -35, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.3,
                            }}
                        >
                            <Icon icon="mdi:tomato" />
                        </motion.div>
                        <motion.div
                            className="absolute text-8xl"
                            style={{ left: '12%', bottom: '12%', color: currentColors.accent }}
                            animate={{
                                opacity: [0.4, 0.7, 0.4],
                                y: [0, -50, 0],
                                scale: [1, 1.3, 1],
                                rotate: [0, 25, 0],
                            }}
                            transition={{
                                duration: 6.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.6,
                            }}
                        >
                            <Icon icon="mdi:carrot" />
                        </motion.div>
                        <motion.div
                            className="absolute text-7xl"
                            style={{ right: '12%', bottom: '15%', color: currentColors.primary }}
                            animate={{
                                opacity: [0.35, 0.65, 0.35],
                                y: [0, 45, 0],
                                scale: [1, 1.25, 1],
                                rotate: [0, -30, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.9,
                            }}
                        >
                            <Icon icon="mdi:cucumber" />
                        </motion.div>
                    </>
                )}
            </div>

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
                    boxShadow: `0 0 30px ${currentColors.glow}`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
