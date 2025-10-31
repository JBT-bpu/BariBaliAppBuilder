'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSaladStore } from '@/lib/store'
import { menuData } from '@/lib/menu'
import { Icon } from '@iconify/react'

// Beautiful 2D animated bowl with floating ingredients
export default function Bowl2D() {
    const { ingredients, toppings, sauces, bread, size } = useSaladStore()
    const [isMixing, setIsMixing] = useState(false)
    const [bowlLevel, setBowlLevel] = useState(0)

    // Listen for mixing events
    useEffect(() => {
        const handleMixingStart = () => setIsMixing(true)
        const handleMixingEnd = () => setIsMixing(false)

        window.addEventListener('mixing-start', handleMixingStart)
        window.addEventListener('mixing-end', handleMixingEnd)

        return () => {
            window.removeEventListener('mixing-start', handleMixingStart)
            window.removeEventListener('mixing-end', handleMixingEnd)
        }
    }, [])

    // Calculate bowl fill level based on ingredients
    useEffect(() => {
        const totalItems = ingredients.length + toppings.length + sauces.length
        const maxItems = size === '750' ? 12 : size === '1000' ? 14 : 16
        setBowlLevel(Math.min(totalItems / maxItems, 1))
    }, [ingredients, toppings, sauces, size])

    // Get ingredient icons from menu data
    const getIngredientIcon = (ingredientId: string) => {
        const veggie = menuData.categories.find(c => c.key === 'veggies')?.items.find(i => i.id === ingredientId)
        if (veggie) return veggie.iconify_id

        const topping = menuData.categories.find(c => c.key === 'primary_extra')?.items.find(i => i.id === ingredientId)
        if (topping) return topping.iconify_id

        const sauce = menuData.categories.find(c => c.key === 'sauces')?.items.find(i => i.id === ingredientId)
        if (sauce) return sauce.iconify_id

        return 'noto:star'
    }

    const allIngredients = [...ingredients, ...toppings, ...sauces]

    return (
        <div className="w-full h-96 relative flex items-center justify-center">
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 rounded-3xl opacity-20"
                animate={{
                    background: isMixing
                        ? 'radial-gradient(circle, #10B981 0%, #059669 50%, #047857 100%)'
                        : 'radial-gradient(circle, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)'
                }}
                transition={{ duration: 0.5 }}
            />

            {/* Bowl SVG */}
            <motion.svg
                width="300"
                height="200"
                viewBox="0 0 300 200"
                className="relative z-10"
                animate={isMixing ? {
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.05, 1]
                } : {
                    rotate: 0,
                    scale: 1
                }}
                transition={{
                    rotate: { duration: 0.8, repeat: isMixing ? Infinity : 0 },
                    scale: { duration: 0.4, repeat: isMixing ? Infinity : 0 }
                }}
            >
                {/* Bowl shadow */}
                <ellipse
                    cx="150"
                    cy="180"
                    rx="120"
                    ry="15"
                    fill="rgba(0,0,0,0.1)"
                />

                {/* Bowl body */}
                <path
                    d="M50 120 Q50 80 150 80 Q250 80 250 120 L250 160 Q250 180 150 180 Q50 180 50 160 Z"
                    fill="url(#bowlGradient)"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                />

                {/* Bowl rim highlight */}
                <path
                    d="M50 120 Q50 85 150 85 Q250 85 250 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                />

                {/* Liquid content */}
                <AnimatePresence>
                    {bowlLevel > 0 && (
                        <motion.path
                            d={`M60 160 Q60 ${160 - bowlLevel * 60} 150 ${160 - bowlLevel * 60} Q240 ${160 - bowlLevel * 60} 240 160 Z`}
                            fill={isMixing ? "#10B981" : "#8B5CF6"}
                            opacity="0.6"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                </AnimatePresence>

                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F9FAFB" />
                        <stop offset="100%" stopColor="#E5E7EB" />
                    </linearGradient>
                </defs>
            </motion.svg>

            {/* Floating ingredients */}
            <AnimatePresence>
                {allIngredients.map((ingredientId, index) => {
                    const iconId = getIngredientIcon(ingredientId)
                    const angle = (index / allIngredients.length) * Math.PI * 2
                    const radius = 80 + (index % 3) * 20
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius - 20

                    return (
                        <motion.div
                            key={`${ingredientId}-${index}`}
                            className="absolute z-20"
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: isMixing ? [1, 1.2, 1] : 1,
                                opacity: 1,
                                rotate: isMixing ? [0, 360] : 0
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                delay: index * 0.1,
                                rotate: { duration: 2, repeat: isMixing ? Infinity : 0, ease: 'linear' },
                                scale: { duration: 0.3, repeat: isMixing ? Infinity : 0 }
                            }}
                        >
                            <div className="bg-white rounded-full p-2 shadow-lg border-2 border-white">
                                <Icon
                                    icon={iconId}
                                    className="w-4 h-4 text-slate"
                                />
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            {/* Bread indicator */}
            <AnimatePresence>
                {bread && (
                    <motion.div
                        className="absolute top-4 right-4 z-30"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="bg-amber-100 rounded-full p-3 shadow-lg border-2 border-amber-200">
                            <Icon
                                icon={bread === 'bread' ? 'noto:bread' : 'noto:bread'}
                                className="w-6 h-6 text-amber-700"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mixing sparkle effects */}
            <AnimatePresence>
                {isMixing && (
                    <>
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-yellow-400 text-2xl z-20"
                                style={{
                                    left: `${30 + i * 10}%`,
                                    top: `${20 + (i % 2) * 40}%`
                                }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: 'easeInOut'
                                }}
                            >
                                ✨
                            </motion.div>
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Bowl stats */}
            <motion.div
                className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate font-medium">
                            {allIngredients.length} מרכיבים
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate font-medium">
                            {Math.round(bowlLevel * 100)}% מלא
                        </span>
                    </div>
                    {isMixing && (
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-3 h-3 bg-purple-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            ></motion.div>
                            <span className="text-purple-600 font-medium">מערבב!</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
