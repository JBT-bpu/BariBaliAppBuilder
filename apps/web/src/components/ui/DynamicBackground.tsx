'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useMemo } from 'react'
import {
    BackgroundTheme,
    BackgroundVariant,
    getBackgroundConfig,
    useBackgroundTheme,
    backgroundAnimations
} from '@/lib/backgroundThemes'

interface DynamicBackgroundProps {
    theme?: BackgroundTheme
    variant?: BackgroundVariant
    className?: string
    children?: React.ReactNode
}

export function DynamicBackground({
    theme,
    variant = 'hero',
    className = '',
    children
}: DynamicBackgroundProps) {
    const pathname = usePathname()

    // Auto-select theme based on current page if not provided
    const selectedTheme = theme || useBackgroundTheme(pathname)

    // Get background configuration
    const config = useMemo(() =>
        getBackgroundConfig(selectedTheme, variant),
        [selectedTheme, variant]
    )

    // Scroll-based parallax for themes that support it
    const { scrollY } = useScroll()
    const parallaxY = useTransform(scrollY, [0, 1000], [0, config.parallax ? -200 : 0])

    // Animation class
    const animationClass = backgroundAnimations[config.animation || 'none']

    return (
        <>
            {/* Background Layer */}
            {config.type === 'image' ? (
                <motion.div
                    className={`fixed inset-0 -z-10 ${animationClass} ${className}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    {...(config.parallax ? { style: { y: parallaxY } } : {})}
                >
                    <Image
                        src={config.value}
                        alt="Background"
                        fill
                        className="object-cover"
                        priority={selectedTheme === 'home'}
                        sizes="100vw"
                    />
                </motion.div>
            ) : (
                <motion.div
                    className={`fixed inset-0 -z-10 ${animationClass} ${className}`}
                    style={{
                        background: config.value,
                        ...(config.parallax ? { y: parallaxY } : {})
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
            )}

            {/* Overlay Layer */}
            {config.overlay && (
                <motion.div
                    className="fixed inset-0 -z-10 pointer-events-none"
                    style={{
                        backgroundColor: config.overlay,
                        ...(config.parallax ? { y: parallaxY } : {})
                    }}
                />
            )}

            {/* Content */}
            {children}
        </>
    )
}

// Hook for programmatic theme changes
export function useDynamicBackground() {
    const pathname = usePathname()

    const getThemeForPage = (page: string): BackgroundTheme => {
        return useBackgroundTheme(page)
    }

    const getThemeForCategory = (category: string): BackgroundTheme => {
        // Map ingredient categories to themes
        const categoryMap: Record<string, BackgroundTheme> = {
            'veggies': 'veggies',
            'proteins': 'proteins',
            'sauces': 'sauces',
            'grains': 'grains',
            'premium': 'premium',
            'cheese': 'premium',
            'nuts': 'premium'
        }

        return categoryMap[category] || 'home'
    }

    return {
        currentTheme: useBackgroundTheme(pathname),
        getThemeForPage,
        getThemeForCategory
    }
}
