'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { sounds } from '@/lib/sounds'
import { haptics } from '@/lib/haptics'
import { categoryGradients, categoryColors, shadows, animations } from '@/ui/tokens'

interface IngredientCardProps {
    name: string
    onClick: () => void
    selected: boolean
    extraCost?: number
    isMulti?: boolean
    category?: 'veggies' | 'sauces' | 'extras' | 'premium'
}

// Map ingredient names to appropriate Iconify icons
const getIngredientIcon = (name: string) => {
    const iconMap: Record<string, string> = {
        // Greens
        'חסה': 'noto:leafy-green',
        'כרוב קל': 'noto:cabbage',
        'תרד': 'noto:leafy-green',
        'ירקות מעורבים': 'noto:leafy-green',
        'רוקט': 'noto:leafy-green',

        // Vegetables
        'עגבנייה': 'noto:tomato',
        'מלפפון': 'noto:cucumber',
        'גזר': 'noto:carrot',
        'פלפל': 'noto:bell-pepper',
        'סלק': 'noto:carrot',

        // Legumes
        'חומוס': 'noto:peas',
        'עדשים': 'noto:peas',
        'פולי שעועית': 'noto:peas',

        // Proteins
        'עוף': 'noto:chicken',
        'טונה': 'noto:fish',
        'טופו': 'noto:tofu',
        'חלוומי': 'noto:cheese-wedge',
        'ביצה': 'noto:egg',
        'סלמון': 'noto:fish',
        'חזה הודו': 'noto:chicken',

        // Extras
        'אבוקדו': 'noto:avocado',
        'אגוזים': 'noto:chestnut',
        'קראנצ׳י': 'noto:seedling',
        'זרעי צ׳יה': 'noto:seedling',
        'כוסמת': 'noto:corn',

        // Dressings
        'לימון זעתר': 'noto:lemon',
        'טחינה': 'noto:bottle-with-popping-cork',
        'בלסמי': 'noto:bottle-with-popping-cork',
        'קיסר': 'noto:leafy-green',
        'שמן זית': 'noto:olive',
    }

    return iconMap[name] || 'noto:question-mark'
}

export default function IngredientCard({ name, onClick, selected, extraCost, category = 'veggies' }: IngredientCardProps) {
    const handleClick = () => {
        // Play sound and haptic feedback
        sounds.tap.play()
        haptics.tap()

        // Execute the original onClick
        onClick()
    }

    const iconName = getIngredientIcon(name)
    const categoryColor = categoryColors[category]

    return (
        <motion.div
            className={`relative h-18 w-full rounded-3xl cursor-pointer flex items-center justify-center text-center font-semibold overflow-hidden ${selected
                ? 'text-white shadow-2xl'
                : 'bg-white/80 backdrop-blur-sm border border-white/20 text-slate hover:bg-white/90'
                }`}
            style={{
                background: selected
                    ? categoryColor.gradient
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: selected ? 'blur(16px)' : 'blur(12px)',
                WebkitBackdropFilter: selected ? 'blur(16px)' : 'blur(12px)',
                boxShadow: selected
                    ? `${shadows.xl}, ${shadows.inner}, 0 0 20px ${categoryColor.glow}`
                    : `${shadows.md}, 0 1px 0 rgba(255, 255, 255, 0.8)`,
                border: selected ? `1px solid rgba(255, 255, 255, 0.2)` : `1px solid ${categoryColor.light}40`
            }}
            whileHover={{
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2, ease: 'easeOut' }
            }}
            whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
            }}
            animate={{
                opacity: selected ? 1 : 0.95,
            }}
            initial={{ opacity: 0, y: 20 }}
            onClick={handleClick}
        >
            {/* Premium glassmorphism overlay */}
            <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                    background: selected
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
                animate={{
                    opacity: selected ? 0.3 : 0.1
                }}
                transition={{ duration: 0.3 }}
            />

            <div className="flex items-center gap-3 px-4 py-2 relative z-10">
                <motion.div
                    className={`p-2 rounded-full ${selected ? 'bg-white/20' : 'bg-slate/10'}`}
                    animate={{
                        rotate: selected ? [0, 15, -15, 0] : 0,
                        scale: selected ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                        duration: selected ? 0.6 : 0.3,
                        ease: 'easeInOut'
                    }}
                    whileHover={{
                        rotate: 5,
                        transition: { duration: 0.2 }
                    }}
                >
                    <Icon
                        icon={iconName}
                        className={`w-4 h-4 ${selected ? 'text-white drop-shadow-sm' : 'text-gray-600'}`}
                    />
                </motion.div>
                <span className="truncate text-sm font-medium">{name}</span>
            </div>

            {extraCost && extraCost > 0 && (
                <motion.div
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg border border-white/20"
                    style={{
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 600,
                        damping: 20,
                        delay: 0.1
                    }}
                    whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2 }
                    }}
                >
                    +₪{extraCost}
                </motion.div>
            )}

            {selected && (
                <motion.div
                    className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        delay: 0.3,
                        type: 'spring',
                        stiffness: 500
                    }}
                >
                    <motion.div
                        className="w-2.5 h-2.5 bg-green-600 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>
            )}

            {/* Subtle shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: 'easeInOut'
                }}
            />
        </motion.div>
    )
}
