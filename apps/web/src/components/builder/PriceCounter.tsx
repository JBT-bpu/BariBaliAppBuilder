'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useSaladStore } from '@/lib/store'

export default function PriceCounter() {
    const { price, calculatePrice } = useSaladStore()
    const [displayPrice, setDisplayPrice] = React.useState(price)
    const [isAnimating, setIsAnimating] = React.useState(false)

    // Calculate price on mount and when store changes
    React.useEffect(() => {
        calculatePrice()
    }, [calculatePrice])

    // Animate price changes with counting effect
    React.useEffect(() => {
        if (price !== displayPrice) {
            setIsAnimating(true)
            const startPrice = displayPrice
            const endPrice = price
            const duration = 500
            const steps = 20
            const increment = (endPrice - startPrice) / steps
            let currentStep = 0

            const timer = setInterval(() => {
                currentStep++
                const currentPrice = Math.round(startPrice + increment * currentStep)
                setDisplayPrice(currentPrice)

                if (currentStep >= steps) {
                    setDisplayPrice(endPrice)
                    setIsAnimating(false)
                    clearInterval(timer)
                }
            }, duration / steps)

            return () => clearInterval(timer)
        }
    }, [price, displayPrice])

    // Color based on price range
    const getPriceColor = (price: number) => {
        if (price < 30) return 'text-green-500'
        if (price < 50) return 'text-amber-500'
        if (price < 70) return 'text-orange-500'
        return 'text-red-500'
    }

    return (
        <motion.div
            className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center justify-center space-x-3">
                <Icon icon="mdi:cash-multiple" className="w-6 h-6 text-slate/70" />
                <span className="text-lg font-semibold text-slate">סה״כ:</span>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={displayPrice}
                        className={`text-3xl font-bold ${getPriceColor(displayPrice)} ${isAnimating ? 'animate-pulse' : ''}`}
                        initial={{ scale: 0.8, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        ₪{displayPrice}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
