'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => setIsLoading(false), 300)
        return () => clearTimeout(timer)
    }, [pathname])

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.98,
            y: 20,
        },
        in: {
            opacity: 1,
            scale: 1,
            y: 0,
        },
        out: {
            opacity: 0,
            scale: 1.02,
            y: -20,
        },
    }

    const pageTransition = {
        type: 'tween' as const,
        ease: 'anticipate' as const,
        duration: 0.4,
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
