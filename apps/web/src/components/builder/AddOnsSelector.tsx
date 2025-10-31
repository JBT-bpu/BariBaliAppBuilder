'use client'

import { motion } from 'framer-motion'
import { useSaladStore } from '@/lib/store'
import { menuData, type MenuItem } from '@/lib/menu'
import { sounds } from '@/lib/sounds'
import { haptics } from '@/lib/haptics'
import { Icon } from '@iconify/react'

interface AddOnsSelectorProps {
    type: 'toppings' | 'sauces'
    title: string
    items: string[]
    selectedItems: string[]
    maxItems: number
    onAdd: (item: string) => void
    onRemove: (item: string) => void
    iconMap: Record<string, string>
}

export default function AddOnsSelector({
    type,
    title,
    items,
    selectedItems,
    maxItems,
    onAdd,
    onRemove,
    iconMap
}: AddOnsSelectorProps) {
    const { language } = useSaladStore()
    const canAddMore = selectedItems.length < maxItems

    // Create lookup maps for translations
    const itemMap: Record<string, MenuItem> = {}
    const category = menuData.categories.find(c => c.key === (type === 'toppings' ? 'primary_extra' : 'sauces'))
    category?.items.forEach(item => {
        itemMap[item.id] = item
    })

    const handleItemClick = (item: string) => {
        const isSelected = selectedItems.includes(item)

        if (isSelected) {
            onRemove(item)
            sounds.tap.play()
            haptics.tap()
        } else if (canAddMore) {
            onAdd(item)
            sounds.plop.play()
            haptics.success()
        }
    }

    const getDisplayName = (itemId: string) => {
        const item = itemMap[itemId]
        return item ? item[language] || item.en || itemId : itemId
    }

    return (
        <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between mb-6">
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Icon icon={type === 'toppings' ? 'mdi:plus-circle-outline' : 'mdi:cup-outline'} className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-slate">{title}</h3>
                </motion.div>
                <motion.div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedItems.length >= maxItems
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                    {selectedItems.length}/{maxItems}
                </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map((item, index) => {
                    const isSelected = selectedItems.includes(item)
                    const isDisabled = !isSelected && !canAddMore
                    const iconifyId = iconMap[item] || 'noto:star'

                    return (
                        <motion.button
                            key={item}
                            onClick={() => !isDisabled && handleItemClick(item)}
                            className={`relative h-18 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl'
                                    : isDisabled
                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                        : 'border-white/40 bg-white/60 hover:border-blue-300/50 hover:bg-white/80 hover:shadow-lg'
                                }`}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
                            whileHover={!isDisabled ? { scale: 1.03, y: -2 } : {}}
                            whileTap={!isDisabled ? { scale: 0.97 } : {}}
                        >
                            <div className="flex flex-col items-center justify-center h-full p-3 gap-2">
                                <motion.div
                                    className={`p-2 rounded-xl ${isSelected ? 'bg-blue-100' : 'bg-white/50'}`}
                                    whileHover={!isDisabled ? { rotate: 10 } : {}}
                                >
                                    <Icon
                                        icon={iconifyId}
                                        className={`w-7 h-7 ${isSelected ? 'text-blue-600' : isDisabled ? 'text-gray-400' : 'text-slate'}`}
                                    />
                                </motion.div>
                                <span className={`text-xs font-bold text-center leading-tight ${isSelected ? 'text-blue-700' : isDisabled ? 'text-gray-400' : 'text-slate'}`}>
                                    {getDisplayName(item)}
                                </span>
                            </div>

                            {isSelected && (
                                <motion.div
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="w-3.5 h-3.5 bg-white rounded-full"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [1, 0.7, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            )}

                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                animate={isSelected ? {
                                    translateX: ['0%', '200%']
                                } : {}}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 4,
                                    ease: 'easeInOut'
                                }}
                            />
                        </motion.button>
                    )
                })}
            </div>

            {selectedItems.length > 0 && (
                <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Icon icon="mdi:check-circle-outline" className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">נבחר:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item, index) => (
                            <motion.div
                                key={item}
                                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-2 rounded-full text-xs font-semibold border border-blue-200/50"
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {getDisplayName(item)}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
