'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useSaladStore } from '@/lib/store'
import { shadows } from '@/ui/tokens'

export default function Bowl() {
    const { ingredients: selectedIngredients, protein, extras, dressing } = useSaladStore()

    // Create ingredient dots with enhanced colors and effects
    const ingredientDots = [
        ...selectedIngredients.map((i, index) => ({
            key: `ingredient-${i}`,
            icon: <Icon icon="noto:leafy-green" className="w-4 h-4 text-white drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-emerald-400 to-green-500',
            glow: 'shadow-emerald-400/50',
            delay: index * 0.08
        })),
        ...(protein ? [{
            key: 'protein',
            icon: <Icon icon="noto:chicken" className="w-4 h-4 text-white drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-amber-400 to-orange-500',
            glow: 'shadow-amber-400/50',
            delay: selectedIngredients.length * 0.08
        }] : []),
        ...extras.map((e, index) => ({
            key: `extra-${e}`,
            icon: <Icon icon="noto:cheese-wedge" className="w-4 h-4 text-white drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-orange-400 to-red-500',
            glow: 'shadow-orange-400/50',
            delay: (selectedIngredients.length + (protein ? 1 : 0) + index) * 0.08
        })),
        ...(dressing ? [{
            key: 'dressing',
            icon: <Icon icon="noto:bottle-with-popping-cork" className="w-4 h-4 text-white drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-blue-400 to-purple-500',
            glow: 'shadow-blue-400/50',
            delay: (selectedIngredients.length + (protein ? 1 : 0) + extras.length) * 0.08
        }] : [])
    ]

    return (
        <div className="flex flex-col items-center">
            {/* Premium depth shadow container */}
            <div className="relative">
                {/* Multiple layered shadows for depth */}
                <div
                    className="absolute inset-0 rounded-3xl transform translate-y-1"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(10, 61, 46, 0.15) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                        zIndex: -1
                    }}
                />
                <div
                    className="absolute inset-0 rounded-3xl transform translate-y-2"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(10, 61, 46, 0.08) 0%, transparent 60%)',
                        filter: 'blur(12px)',
                        zIndex: -2
                    }}
                />

                <motion.div
                    className="relative w-44 h-32 rounded-3xl overflow-hidden cursor-pointer"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: `${shadows.xl}, inset 0 1px 0 rgba(255,255,255,0.2)`
                    }}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
                    whileHover={{
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.3, ease: 'easeOut' }
                    }}
                    whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 }
                    }}
                >
                    {/* Glassmorphism background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(74,157,95,0.1) 0%, rgba(245,158,11,0.05) 100%)'
                        }}
                    />

                    {/* Ingredient dots with enhanced effects */}
                    {ingredientDots.map((dot, index) => (
                        <motion.div
                            key={dot.key}
                            className={`absolute ${dot.color} rounded-full flex items-center justify-center ${dot.glow} shadow-lg`}
                            style={{
                                width: '24px',
                                height: '24px',
                                left: `${15 + (index * 17) % 70}%`,
                                top: `${25 + (index * 22) % 50}%`,
                                boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.3)`
                            }}
                            initial={{ scale: 0, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{
                                delay: dot.delay,
                                type: 'spring',
                                stiffness: 500,
                                damping: 25
                            }}
                            whileHover={{
                                scale: 1.3,
                                rotate: 15,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {dot.icon}
                        </motion.div>
                    ))}

                    {/* Enhanced fill effect with multiple layers */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                            background: 'linear-gradient(to top, rgba(74,157,95,0.3) 0%, rgba(74,157,95,0.1) 50%, transparent 100%)'
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(ingredientDots.length * 6, 70)}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    />

                    {/* Subtle inner glow */}
                    <motion.div
                        className="absolute inset-2 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                            opacity: ingredientDots.length > 0 ? 0.6 : 0.3
                        }}
                        animate={{
                            opacity: ingredientDots.length > 0 ? [0.6, 0.8, 0.6] : 0.3
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>

                {/* Enhanced labels with better typography */}
                <motion.div
                    className="mt-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="text-base font-bold text-slate mb-1">הקערה שלך</div>
                    <div className="text-sm text-slate/80 font-medium">
                        {ingredientDots.length} מרכיבים נבחרו
                    </div>
                    {ingredientDots.length === 0 && (
                        <motion.div
                            className="text-xs text-slate/60 mt-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            בחר מרכיבים כדי למלא את הקערה
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
