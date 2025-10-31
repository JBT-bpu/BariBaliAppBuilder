'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useSaladStore } from '@/lib/store'
import { getNutritionTarget } from '@/lib/nutrition'
import { getIngredientFact } from '@/lib/ingredientFacts'
import { useEffect, useState } from 'react'
import { shadows } from '@/ui/tokens'
import { Icon } from '@iconify/react'

export default function NutritionMeter() {
    const { nutritionTotal, nutritionBadges, size, lastIngredientId } = useSaladStore()
    const [animatedValues, setAnimatedValues] = useState(nutritionTotal)
    const [ingredientFact, setIngredientFact] = useState(getIngredientFact(lastIngredientId || ''))

    // Animate values when they change
    useEffect(() => {
        setAnimatedValues(nutritionTotal)
    }, [nutritionTotal])

    // Update ingredient fact when last ingredient changes
    useEffect(() => {
        if (lastIngredientId) {
            setIngredientFact(getIngredientFact(lastIngredientId))
        }
    }, [lastIngredientId])

    const target = size ? getNutritionTarget(size) : getNutritionTarget('1000')
    const kcalPercentage = Math.min((animatedValues.kcal / target.kcal) * 100, 100)

    // Determine ring color based on kcal percentage
    const getRingColor = () => {
        if (kcalPercentage < 70) return 'text-green-500'
        if (kcalPercentage < 90) return 'text-amber-500'
        return 'text-red-500'
    }

    const getRingBgColor = () => {
        if (kcalPercentage < 70) return 'text-green-100'
        if (kcalPercentage < 90) return 'text-amber-100'
        return 'text-red-100'
    }

    // Prepare data for donut chart
    const macroData = [
        {
            name: 'חלבון',
            value: Math.max(animatedValues.protein, 0.1), // Ensure minimum value for visibility
            color: '#FF6B9D', // Protein - pink
            target: target.protein.max
        },
        {
            name: 'פחמימות',
            value: Math.max(animatedValues.carbs, 0.1), // Ensure minimum value for visibility
            color: '#4ECDC4', // Carbs - teal
            target: 80 // Approximate target
        },
        {
            name: 'שומנים',
            value: Math.max(animatedValues.fat, 0.1), // Ensure minimum value for visibility
            color: '#FFD93B', // Fat - yellow
            target: target.fat || 40
        }
    ]

    const totalMacros = macroData.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate">נתוני תזונה</h3>
                <p className="text-sm text-slate/60">מעקב בזמן אמת</p>
            </div>

            {/* Target Ring with kcal */}
            <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                    {/* Background ring */}
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className={getRingBgColor()}
                        />
                        {/* Progress ring */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            className={getRingColor()}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: kcalPercentage / 100 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{
                                strokeDasharray: '251.2',
                                strokeDashoffset: '251.2'
                            }}
                        />
                    </svg>

                    {/* Center text - Ingredient Fact or Calories */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {ingredientFact ? (
                            <motion.div
                                className="flex flex-col items-center justify-center gap-1"
                                key={lastIngredientId}
                                initial={{ scale: 0.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.4 }}
                            >
                                <Icon icon={ingredientFact.icon} width={24} height={24} className="text-green-500" />
                                <div className="text-xs font-semibold text-slate text-center leading-tight max-w-[60px]">
                                    {ingredientFact.fact.split(' → ')[0]}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="text-xl font-bold text-slate"
                                key={animatedValues.kcal}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {Math.round(animatedValues.kcal)}
                            </motion.div>
                        )}
                        <div className="text-xs text-slate/60">
                            {ingredientFact ? 'בריאות' : 'קלוריות'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Donut Chart */}
            <div className="flex justify-center mb-4">
                <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                            <Pie
                                data={macroData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                {macroData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="rgba(255,255,255,0.3)"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            className="text-lg font-bold text-slate"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            {totalMacros.toFixed(1)}g
                        </motion.div>
                        <div className="text-xs text-slate/60">סה״כ</div>
                    </div>
                </motion.div>
            </div>

            {/* Macro Legend with Values */}
            <div className="space-y-2">
                {macroData.map((macro, index) => (
                    <motion.div
                        key={macro.name}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: macro.color }}
                            />
                            <span className="text-xs font-medium text-slate">{macro.name}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate">
                            {macro.value.toFixed(1)}g
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Badges */}
            {nutritionBadges.length > 0 && (
                <motion.div
                    className="mt-4 flex flex-wrap gap-2 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {nutritionBadges.map((badge, index) => (
                        <motion.div
                            key={badge}
                            className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index, type: 'spring', stiffness: 300 }}
                        >
                            {badge}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Target info */}
            <div className="mt-4 text-center text-xs text-slate/60">
                מטרה: {target.kcal} קלוריות • {target.protein.min}-{target.protein.max}g חלבון
            </div>
        </div>
    )
}
