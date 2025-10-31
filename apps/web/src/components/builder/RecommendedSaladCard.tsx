'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface RecommendedSaladCardProps {
    name: string
    description: string
    ingredients: string[]
    protein: string
    extras: string[]
    dressing: string
    price: number
    onConfirm: () => void
    onEdit: () => void
}

export default function RecommendedSaladCard({
    name,
    description,
    ingredients,
    protein,
    extras,
    dressing,
    price,
    onConfirm,
    onEdit
}: RecommendedSaladCardProps) {
    return (
        <motion.div
            className="bg-gradient-to-br from-lemon to-yellow-200 rounded-3xl p-6 shadow-xl border-4 border-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-6">
                <motion.div
                    className="text-4xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    ⭐
                </motion.div>
                <h2 className="text-2xl font-bold text-slate mb-2">סלט היום</h2>
                <h3 className="text-xl font-semibold text-slate mb-2">{name}</h3>
                <p className="text-slate text-sm">{description}</p>
            </div>

            <div className="bg-white/80 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-slate mb-3">רכיבים:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {ingredients.slice(0, 6).map((ingredient, index) => (
                        <motion.div
                            key={index}
                            className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {ingredient}
                        </motion.div>
                    ))}
                    {ingredients.length > 6 && (
                        <div className="text-sm text-slate text-center">
                            +{ingredients.length - 6} נוספים
                        </div>
                    )}
                </div>

                <div className="space-y-1 text-sm text-slate">
                    {protein && <div>חלבון: {protein}</div>}
                    {extras.length > 0 && <div>תוספות: {extras.join(', ')}</div>}
                    {dressing && <div>רטב: {dressing}</div>}
                </div>
            </div>

            <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green">₪{price}</div>
            </div>

            <div className="flex gap-3">
                <motion.button
                    onClick={onConfirm}
                    className="flex-1 h-14 bg-green text-white font-semibold rounded-2xl text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    אשר והמשך
                </motion.button>
                <motion.button
                    onClick={onEdit}
                    className="h-14 px-6 bg-white text-slate font-semibold rounded-2xl border-2 border-slate"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ערוך
                </motion.button>
            </div>
        </motion.div>
    )
}
