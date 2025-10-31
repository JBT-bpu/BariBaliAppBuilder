'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadows, animations, categoryColors } from '@/ui/tokens';

export interface CategoryTab {
    key: string;
    label: string;
    count?: number;
    maxCount?: number;
}

interface CategoryTabsProps {
    tabs: CategoryTab[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
    className?: string;
}

export const CategoryTabs = React.memo(function CategoryTabs({
    tabs,
    activeTab,
    onTabChange,
    className,
}: CategoryTabsProps) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [activeTabRect, setActiveTabRect] = React.useState<DOMRect | null>(null);

    // Scroll active tab into view and calculate underline position
    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const activeButton = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
        if (activeButton) {
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });

            // Calculate position for animated underline
            const containerRect = container.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();
            setActiveTabRect({
                ...buttonRect,
                left: buttonRect.left - containerRect.left + container.scrollLeft,
                width: buttonRect.width,
            } as DOMRect);
        }
    }, [activeTab]);

    return (
        <div
            className={cn(
                'relative w-full bg-white/90 backdrop-blur-md border-b border-white/30',
                'shadow-sm',
                className
            )}
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: shadows.sm
            }}
        >
            <div
                ref={scrollContainerRef}
                className="relative flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide snap-x snap-mandatory"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.key;
                    const showCount = tab.count !== undefined && tab.maxCount !== undefined;

                    // Map tab keys to category colors
                    const getCategoryColor = (key: string) => {
                        const categoryMap: Record<string, keyof typeof categoryColors> = {
                            'ירקות': 'veggies',
                            'רטבים': 'sauces',
                            'תוספות': 'extras',
                            'פרימיום': 'premium',
                            'לחם': 'extras',
                            'בשר': 'premium',
                        };
                        return categoryColors[categoryMap[key] || 'veggies'];
                    };

                    const categoryColor = getCategoryColor(tab.key);

                    return (
                        <motion.button
                            key={tab.key}
                            data-tab={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={cn(
                                'relative flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold',
                                'transition-all duration-200 snap-center',
                                'focus:outline-none focus:ring-2 focus:ring-green/50 focus:ring-offset-1',
                                'hover:shadow-md',
                                isActive
                                    ? 'text-white'
                                    : 'text-gray-700 hover:text-gray-900'
                            )}
                            style={{
                                background: isActive
                                    ? categoryColor.gradient
                                    : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: isActive ? 'blur(8px)' : 'none',
                                WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                                boxShadow: isActive
                                    ? `${shadows.md}, inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 15px ${categoryColor.glow}`
                                    : '0 1px 3px rgba(0, 0, 0, 0.05)',
                                border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : `1px solid ${categoryColor.light}40`
                            }}
                            whileHover={{
                                scale: 1.03,
                                y: -1,
                                transition: { duration: 0.15 }
                            }}
                            whileTap={{
                                scale: 0.97,
                                transition: { duration: 0.1 }
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: 'easeOut'
                            }}
                        >
                            <span className="flex items-center gap-2 relative z-10">
                                <span className={cn(
                                    'transition-all duration-200',
                                    isActive && 'text-shadow-sm'
                                )}>
                                    {tab.label}
                                </span>
                                {showCount && (
                                    <motion.span
                                        className={cn(
                                            'text-xs px-2 py-0.5 rounded-full font-bold text-center min-w-[32px]',
                                            'transition-all duration-200',
                                            isActive
                                                ? 'bg-white/25 text-white border border-white/30'
                                                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                                        )}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {tab.count}/{tab.maxCount}
                                    </motion.span>
                                )}
                            </span>

                            {/* Premium glow effect for active tab */}
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl opacity-60"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(90, 197, 104, 0.1) 100%)',
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 0.4, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Animated underline indicator */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                style={{
                    boxShadow: '0 1px 3px rgba(90, 197, 104, 0.4)'
                }}
                initial={false}
                animate={{
                    width: activeTabRect?.width || 0,
                    x: activeTabRect?.left || 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    duration: 0.3
                }}
            />

            {/* Subtle bottom border gradient */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(90, 197, 104, 0.2) 50%, transparent 100%)'
                }}
            />
        </div>
    );
});
