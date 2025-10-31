'use client'

import { motion } from 'framer-motion'
import { useSaladStore } from '@/lib/store'
import { Leaf, Beef, Cookie, Droplets, Sparkles } from 'lucide-react'

export default function BowlVisualization() {
    const { ingredients: selectedIngredients, protein, extras, dressing } = useSaladStore()

    // Create ingredient layers with enhanced visuals
    const ingredientLayers = [
        // Base layer (greens)
        ...selectedIngredients
            .filter(i => ['חסה', 'כרוב קל', 'תרד', 'ירקות מעורבים', 'רוקט'].includes(i))
            .map((i, index) => ({
                key: `base-${i}`,
                icon: <Leaf className="w-3 h-3 text-emerald-600 drop-shadow-sm" />,
                color: 'bg-gradient-to-br from-emerald-300 to-green-400',
                glow: 'shadow-emerald-400/40',
                layer: 0,
                delay: index * 0.1
            })),
        // Vegetables layer
        ...selectedIngredients
            .filter(i => ['עגבנייה', 'מלפפון', 'גזר', 'פלפל', 'סלק', 'בצל אדום', 'בצל ירוק', 'שום'].includes(i))
            .map((i, index) => ({
                key: `veg-${i}`,
                icon: <Leaf className="w-3 h-3 text-orange-600 drop-shadow-sm" />,
                color: 'bg-gradient-to-br from-orange-300 to-red-400',
                glow: 'shadow-orange-400/40',
                layer: 1,
                delay: (selectedIngredients.filter(i => ['חסה', 'כרוב קל', 'תרד', 'ירקות מעורבים', 'רוקט'].includes(i)).length + index) * 0.1
            })),
        // Protein layer
        ...(protein ? [{
            key: 'protein',
            icon: <Beef className="w-4 h-4 text-amber-600 drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-amber-400 to-orange-500',
            glow: 'shadow-amber-400/50',
            layer: 2,
            delay: selectedIngredients.length * 0.1
        }] : []),
        // Extras layer
        ...extras.map((e, index) => ({
            key: `extra-${e}`,
            icon: <Cookie className="w-3 h-3 text-purple-600 drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-purple-400 to-pink-500',
            glow: 'shadow-purple-400/40',
            layer: 3,
            delay: (selectedIngredients.length + (protein ? 1 : 0) + index) * 0.1
        })),
        // Dressing layer
        ...(dressing ? [{
            key: 'dressing',
            icon: <Droplets className="w-3 h-3 text-blue-600 drop-shadow-sm" />,
            color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
            glow: 'shadow-blue-400/40',
            layer: 4,
            delay: (selectedIngredients.length + (protein ? 1 : 0) + extras.length) * 0.1
        }] : [])
    ]

    // Calculate bowl fill based on layers
    const fillPercentage = Math.min(ingredientLayers.length * 8 + 20, 90)

    // Dynamic bowl color based on dominant ingredients
    const getBowlColor = () => {
        if (protein) return 'from-amber-100 to-orange-200'
        if (extras.length > 0) return 'from-purple-100 to-pink-200'
        if (selectedIngredients.length > 5) return 'from-green-100 to-emerald-200'
        return 'from-slate-100 to-gray-200'
    }

    return (
        <div className="flex flex-col items-center">
            <motion.div
                className="relative w-48 h-36 rounded-3xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${getBowlColor().includes('from-') ? `var(--tw-gradient-from), var(--tw-gradient-to)` : 'rgba(255,255,255,0.15)'} 0%, rgba(255,255,255,0.05) 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
            >
                {/* Animated background gradient */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${getBowlColor()}`}
                    animate={{
                        opacity: ingredientLayers.length > 0 ? [0.3, 0.5, 0.3] : 0.2
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Ingredient layers with physics */}
                {ingredientLayers.map((layer, index) => {
                    const layerOffset = layer.layer * 8
                    const randomX = (index * 17) % 60 - 30
                    const randomY = layerOffset + ((index * 23) % 20 - 10)

                    return (
                        <motion.div
                            key={layer.key}
                            className={`absolute ${layer.color} rounded-full flex items-center justify-center ${layer.glow} shadow-lg`}
                            style={{
                                width: '20px',
                                height: '20px',
                                left: `calc(50% + ${randomX}px)`,
                                top: `calc(${80 - randomY}% - 10px)`,
                                boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.3)`
                            }}
                            initial={{
                                scale: 0,
                                opacity: 0,
                                rotate: -180,
                                y: 50
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                rotate: 0,
                                y: 0
                            }}
                            transition={{
                                delay: layer.delay,
                                type: 'spring',
                                stiffness: 400,
                                damping: 20
                            }}
                            whileHover={{
                                scale: 1.2,
                                rotate: 15,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {layer.icon}
                        </motion.div>
                    )
                })}

                {/* Liquid fill effect */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        background: 'linear-gradient(to top, rgba(74,157,95,0.4) 0%, rgba(74,157,95,0.2) 50%, rgba(34,197,94,0.1) 80%, transparent 100%)',
                        borderRadius: '0 0 24px 24px'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${fillPercentage}%` }}
                    transition={{
                        duration: 1.2,
                        ease: 'easeOut',
                        delay: 0.3
                    }}
                />

                {/* Shimmer effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 8,
                        ease: 'easeInOut'
                    }}
                />

                {/* Sparkle effects for premium feel */}
                {ingredientLayers.length > 3 && (
                    <>
                        <motion.div
                            className="absolute top-4 right-6 text-yellow-400"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <Sparkles className="w-3 h-3" />
                        </motion.div>
                        <motion.div
                            className="absolute bottom-6 left-4 text-yellow-400"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1
                            }}
                        >
                            <Sparkles className="w-2 h-2" />
                        </motion.div>
                    </>
                )}
            </motion.div>

            {/* Enhanced labels */}
            <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="text-lg font-bold text-slate mb-1">הקערה שלך</div>
                <div className="text-sm text-slate/80 font-medium">
                    {ingredientLayers.length} מרכיבים נבחרו
                </div>
                {ingredientLayers.length === 0 && (
                    <motion.div
                        className="text-xs text-slate/60 mt-2 px-4 py-2 bg-white/50 rounded-xl backdrop-blur-sm"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        בחר מרכיבים כדי למלא את הקערה ✨
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
