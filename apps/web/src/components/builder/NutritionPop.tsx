'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PopData } from '@/lib/useNutritionPop'

interface NutritionPopProps {
    pop: PopData | null
    onHide: () => void
}

export default function NutritionPop({ pop, onHide }: NutritionPopProps) {
    if (!pop) return null

    // Calculate position (above the tapped element, centered)
    const top = pop.anchor.top - 12
    const left = pop.anchor.left + (pop.anchor.width / 2)

    return (
        <AnimatePresence>
            {pop && (
                <>
                    {/* Backdrop to hide on tap */}
                    <motion.div
                        className="fixed inset-0 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onHide}
                    />

                    {/* Popup */}
                    <motion.div
                        className="fixed z-50 pointer-events-none"
                        style={{
                            top: `${top}px`,
                            left: `${left}px`,
                            transform: 'translateX(-50%)'
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 0
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: -8
                        }}
                        transition={{
                            duration: 0.12,
                            ease: 'easeOut'
                        }}
                    >
                        {/* Arrow */}
                        <div className="flex justify-center mb-1">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                        </div>

                        {/* Content */}
                        <div className="bg-white/95 text-slate-900 px-3 py-2 rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,.08)] max-w-xs">
                            <div className="flex items-center gap-2">
                                {/* Icon */}
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs">🥗</span>
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] leading-tight font-medium">
                                        {pop.text}
                                    </p>

                                    {/* Macro chip */}
                                    {pop.macroChip && (
                                        <div className="mt-1">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                {pop.macroChip}
                                            </span>
                                        </div>
                                    )}

                                    {/* Badge */}
                                    {pop.badge && (
                                        <div className="mt-1">
                                            <span className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                {pop.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
