'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSaladStore } from '@/lib/store'
import { menuData, type MenuItem } from '@/lib/menu'
import { translations } from '@/lib/translations'
import { sounds } from '@/lib/sounds'
import { haptics } from '@/lib/haptics'
import { BowlCanvas } from '@/components/builder/BowlCanvas'
import { IngredientChip } from '@/components/builder/IngredientChip'
import { CategoryTabs, type CategoryTab } from '@/components/builder/CategoryTabs'
import { SelectedItemsStats } from '@/components/builder/SelectedItemsStats'
import { ParallaxBackground } from '@/components/builder/ParallaxBackground'
import PriceCounter from '@/components/builder/PriceCounter'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NutritionPop from '@/components/builder/NutritionPop'
import { SaladMixingAnimation } from '@/components/builder/SaladMixingAnimation'
import { useNutritionPop } from '@/lib/useNutritionPop'
import Link from 'next/link'
import { ArrowRight, ShoppingCart } from 'lucide-react'

export default function InteractiveBuilderPage() {
    const {
        language,
        size,
        ingredients,
        toppings,
        sauces,
        paidAdditions,
        maxIngredients,
        nutritionTotal,
        addIngredient,
        removeIngredient,
        addTopping,
        removeTopping,
        addSauce,
        removeSauce,
        addPaidAddition,
        removePaidAddition,
        calculatePrice,
        calculateNutrition,
        canAddIngredient,
        canAddTopping,
        canAddSauce,
        canAddPaidAddition,
        setSize,
        reset
    } = useSaladStore()

    const t = (key: string) => translations[language][key as keyof typeof translations.he] || key

    const [activeCategory, setActiveCategory] = useState('veggies')
    const [showMixingAnimation, setShowMixingAnimation] = useState(false)
    const { pop, show: showNutritionPop, hide: hideNutritionPop } = useNutritionPop()

    // Initialize with default size and calculate price
    useEffect(() => {
        if (!size) {
            setSize('1000')
        }
        reset()
    }, [])

    // Calculate price when size changes
    useEffect(() => {
        if (size) {
            calculatePrice()
        }
    }, [size, calculatePrice])

    // Build category tabs
    const categoryTabs: CategoryTab[] = useMemo(() => {
        const veggiesCategory = menuData.categories.find(c => c.key === 'veggies')
        const saucesCategory = menuData.categories.find(c => c.key === 'sauces')
        const toppingsCategory = menuData.categories.find(c => c.key === 'primary_extra')
        const paidCategory = menuData.categories.find(c => c.key === 'paid_additions')

        return [
            {
                key: 'veggies',
                label: language === 'he' ? 'ירקות' : 'Veggies',
                count: ingredients.length,
                maxCount: maxIngredients
            },
            {
                key: 'sauces',
                label: language === 'he' ? 'רטבים' : 'Sauces',
                count: sauces.length,
                maxCount: saucesCategory?.selection.max || 10
            },
            {
                key: 'primary_extra',
                label: language === 'he' ? 'תוספות' : 'Extras',
                count: toppings.length,
                maxCount: toppingsCategory?.selection.max || 2
            },
            {
                key: 'paid_additions',
                label: language === 'he' ? 'פרימיום' : 'Premium',
                count: paidAdditions.length,
                maxCount: paidCategory?.selection.max || 5
            }
        ]
    }, [ingredients.length, sauces.length, toppings.length, paidAdditions.length, maxIngredients, language])

    // Get items for active category
    const activeItems = useMemo(() => {
        const category = menuData.categories.find(c => c.key === activeCategory)
        return category?.items || []
    }, [activeCategory])

    // Handle ingredient selection
    const handleItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
        const categoryKey = activeCategory

        if (categoryKey === 'veggies') {
            const isSelected = ingredients.includes(item.id)
            if (isSelected) {
                removeIngredient(item.id)
                sounds.tap.play()
                haptics.tap()
            } else if (canAddIngredient()) {
                addIngredient(item.id)
                sounds.plop.play()
                haptics.success()
                showNutritionPop(item, event.currentTarget as HTMLElement, language)
            }
        } else if (categoryKey === 'sauces') {
            const isSelected = sauces.includes(item.id)
            if (isSelected) {
                removeSauce(item.id)
                sounds.tap.play()
                haptics.tap()
            } else if (canAddSauce()) {
                addSauce(item.id)
                sounds.plop.play()
                haptics.success()
                showNutritionPop(item, event.currentTarget as HTMLElement, language)
            }
        } else if (categoryKey === 'primary_extra') {
            const isSelected = toppings.includes(item.id)
            if (isSelected) {
                removeTopping(item.id)
                sounds.tap.play()
                haptics.tap()
            } else if (canAddTopping()) {
                addTopping(item.id)
                sounds.plop.play()
                haptics.success()
                showNutritionPop(item, event.currentTarget as HTMLElement, language)
            }
        } else if (categoryKey === 'paid_additions') {
            const isSelected = paidAdditions.includes(item.id)
            if (isSelected) {
                removePaidAddition(item.id)
                sounds.tap.play()
                haptics.tap()
            } else if (canAddPaidAddition()) {
                addPaidAddition(item.id)
                sounds.plop.play()
                haptics.success()
                showNutritionPop(item, event.currentTarget as HTMLElement, language)
            }
        }

        calculatePrice()
        calculateNutrition()
    }, [activeCategory, ingredients, sauces, toppings, paidAdditions, language])

    // Check if item is selected
    const isItemSelected = useCallback((item: MenuItem) => {
        if (activeCategory === 'veggies') return ingredients.includes(item.id)
        if (activeCategory === 'sauces') return sauces.includes(item.id)
        if (activeCategory === 'primary_extra') return toppings.includes(item.id)
        if (activeCategory === 'paid_additions') return paidAdditions.includes(item.id)
        return false
    }, [activeCategory, ingredients, sauces, toppings, paidAdditions])

    // Check if item is disabled
    const isItemDisabled = useCallback((item: MenuItem) => {
        const isSelected = isItemSelected(item)
        if (isSelected) return false

        if (activeCategory === 'veggies') return !canAddIngredient()
        if (activeCategory === 'sauces') return !canAddSauce()
        if (activeCategory === 'primary_extra') return !canAddTopping()
        if (activeCategory === 'paid_additions') return !canAddPaidAddition()
        return false
    }, [activeCategory, isItemSelected, canAddIngredient, canAddSauce, canAddTopping, canAddPaidAddition])

    const totalItems = ingredients.length + sauces.length + toppings.length + paidAdditions.length

    const handleBowlClick = () => {
        if (totalItems > 0) {
            setShowMixingAnimation(true)
        }
    }

    const handleMixingComplete = () => {
        setShowMixingAnimation(false)
    }

    return (
        <ParallaxBackground className="min-h-screen bg-cream flex flex-col">
            {/* Sticky Header - 40px on mobile, 48px on desktop */}
            <motion.div
                className="sticky top-0 z-30 bg-white px-2 sm:px-4 py-1 sm:py-2 border-b border-gray-200"
                style={{
                    backgroundImage: 'url(/graphics/header-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 'clamp(40px, 10vh, 48px)'
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center justify-between h-full gap-1 sm:gap-2">
                    <Link href="/">
                        <motion.button
                            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate/10 hover:bg-slate/20 transition-colors flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate" />
                        </motion.button>
                    </Link>

                    {/* Size Display */}
                    {size && (
                        <div className="text-xs sm:text-sm font-semibold text-slate px-2 py-1 bg-slate/5 rounded-lg">
                            {size}ml
                        </div>
                    )}

                    <div className="flex-1" />

                    <LanguageSwitcher />
                </div>
            </motion.div>

            {/* Sticky Bowl Canvas + Stats - Side by side */}
            <motion.div
                className="sticky top-[48px] z-20 bg-gradient-to-b from-cream to-transparent pt-4 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-2xl mx-auto px-2">
                    {/* Bowl - clickable to trigger mixing animation */}
                    <motion.div
                        onClick={handleBowlClick}
                        className={totalItems > 0 ? 'cursor-pointer' : ''}
                        whileHover={totalItems > 0 ? { scale: 1.05 } : {}}
                        whileTap={totalItems > 0 ? { scale: 0.95 } : {}}
                    >
                        <BowlCanvas className="flex-shrink-0" />
                    </motion.div>

                    {/* Compact Stats */}
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {/* Protein */}
                            <motion.div
                                className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200/50 hover:border-blue-400/50 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-[10px] sm:text-xs text-blue-600 font-semibold">חלבון</div>
                                <div className="text-sm sm:text-base font-bold text-blue-700">{Math.round(nutritionTotal.protein)}g</div>
                                <div className="text-[8px] sm:text-xs text-blue-500">P</div>
                            </motion.div>

                            {/* Carbs */}
                            <motion.div
                                className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 hover:border-orange-400/50 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-[10px] sm:text-xs text-orange-600 font-semibold">פחמימות</div>
                                <div className="text-sm sm:text-base font-bold text-orange-700">{Math.round(nutritionTotal.carbs)}g</div>
                                <div className="text-[8px] sm:text-xs text-orange-500">C</div>
                            </motion.div>

                            {/* Fat */}
                            <motion.div
                                className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 hover:border-purple-400/50 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-[10px] sm:text-xs text-purple-600 font-semibold">שומנים</div>
                                <div className="text-sm sm:text-base font-bold text-purple-700">{Math.round(nutritionTotal.fat)}g</div>
                                <div className="text-[8px] sm:text-xs text-purple-500">F</div>
                            </motion.div>

                            {/* Kcal */}
                            <motion.div
                                className="p-2 sm:p-3 bg-gradient-to-br from-green/20 to-lemon/20 backdrop-blur-sm rounded-lg border border-green/50 hover:border-green/80 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-[10px] sm:text-xs text-green font-semibold">קלוריות</div>
                                <div className="text-sm sm:text-base font-bold text-green">{Math.round(nutritionTotal.kcal)}</div>
                                <div className="text-[8px] sm:text-xs text-green/70">kcal</div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Tabs - Sticky below bowl */}
            <div className="sticky top-[260px] z-20">
                <CategoryTabs
                    tabs={categoryTabs}
                    activeTab={activeCategory}
                    onTabChange={setActiveCategory}
                />
            </div>

            {/* Ingredient Grid - 3 columns, scrollable */}
            <div className="flex-1 overflow-y-auto px-2 py-3 pb-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        className="grid grid-cols-3 sm:grid-cols-3 gap-2 max-w-md mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                            >
                                <div title={`${item.he} / ${item.en}`}>
                                    <IngredientChip
                                        ingredient={{
                                            id: item.id,
                                            he: item.he.length > 12 ? item.he.substring(0, 10) + '...' : item.he,
                                            en: item.en.length > 12 ? item.en.substring(0, 10) + '...' : item.en,
                                            icon: (item as any).icon || '🥗',
                                            price_delta: item.price_delta,
                                            unit_price: item.unit_price,
                                            category: activeCategory,
                                            rarity: (item as any).rarity
                                        }}
                                        isSelected={isItemSelected(item)}
                                        isDisabled={isItemDisabled(item)}
                                        onClick={(e) => handleItemClick(item, e)}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticky Bottom Bar - 56px on mobile, 64px on desktop */}
            <motion.div
                className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-white/20 px-2 sm:px-4 py-2 sm:py-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ height: 'clamp(56px, 12vh, 64px)' }}
            >
                <div className="flex items-center justify-between h-full gap-2">
                    <PriceCounter />

                    <Link href="/slot">
                        <motion.button
                            disabled={totalItems === 0}
                            className={`h-10 sm:h-12 px-3 sm:px-6 font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg flex items-center gap-1 sm:gap-2 flex-shrink-0 ${totalItems === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                }`}
                            whileHover={totalItems > 0 ? { scale: 1.05 } : {}}
                            whileTap={totalItems > 0 ? { scale: 0.95 } : {}}
                        >
                            <span>🥗 בה לי!</span>
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Nutrition Pop */}
            <NutritionPop pop={pop} onHide={hideNutritionPop} />

            {/* Salad Mixing Animation */}
            <SaladMixingAnimation
                isVisible={showMixingAnimation}
                onComplete={handleMixingComplete}
            />
        </ParallaxBackground>
    )
}
