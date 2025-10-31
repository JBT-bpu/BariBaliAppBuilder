'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { haptics } from '@/lib/haptics'

interface SavedSaladCardProps {
    id: string
    name: string
    ingredients: string[]
    protein: string
    price: number
    lastOrdered?: Date
    onSelect: () => void
    onEdit: () => void
    onDelete: () => void
}

export default function SavedSaladCard({
    id,
    name,
    ingredients,
    protein,
    price,
    lastOrdered,
    onSelect,
    onEdit,
    onDelete
}: SavedSaladCardProps) {
    const [showActions, setShowActions] = useState(false)

    const formatLastOrdered = (date?: Date) => {
        if (!date) return 'טרם הוזמן'
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return 'הוזמן אתמול'
        if (diffDays < 7) return `הוזמן לפני ${diffDays} ימים`
        if (diffDays < 30) return `הוזמן לפני ${Math.floor(diffDays / 7)} שבועות`
        return `הוזמן לפני ${Math.floor(diffDays / 30)} חודשים`
    }

    return (
        <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:border-blue-300/50 transition-all duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            onHoverStart={() => setShowActions(true)}
            onHoverEnd={() => setShowActions(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon icon="mdi:leaf" className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-bold text-slate">{name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {ingredients.slice(0, 3).map((ingredient, index) => (
                            <motion.span
                                key={index}
                                className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full border border-green-200/50"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {ingredient}
                            </motion.span>
                        ))}
                        {ingredients.length > 3 && (
                            <span className="text-xs text-slate/60 bg-slate-100 px-2 py-1 rounded-full">
                                +{ingredients.length - 3} נוספים
                            </span>
                        )}
                    </div>
                    {protein && (
                        <div className="flex items-center gap-2 text-sm text-slate/80 mb-2">
                            <Icon icon="mdi:food-steak" className="w-4 h-4 text-amber-500" />
                            <span>חלבון: {protein}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate/60">
                        <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                        <span>{formatLastOrdered(lastOrdered)}</span>
                    </div>
                </div>
                <div className="text-right ml-4">
                    <motion.div
                        className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.1 }}
                    >
                        ₪{price}
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="flex gap-3 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                    opacity: showActions ? 1 : 0,
                    height: showActions ? 'auto' : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <motion.button
                    onClick={() => {
                        haptics.select()
                        onSelect()
                    }}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    הזמן
                </motion.button>
                <motion.button
                    onClick={() => {
                        haptics.tap()
                        onEdit()
                    }}
                    className="h-12 px-4 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-semibold rounded-2xl shadow-lg hover:from-slate-500 hover:to-slate-600 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Icon icon="mdi:pencil" className="w-4 h-4" />
                </motion.button>
                <motion.button
                    onClick={() => {
                        haptics.tap()
                        onDelete()
                    }}
                    className="h-12 px-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-2xl shadow-lg hover:from-red-600 hover:to-rose-600 transition-all"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
