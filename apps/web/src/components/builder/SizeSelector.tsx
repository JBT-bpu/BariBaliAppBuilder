'use client'

import { motion } from 'framer-motion'
import { useSaladStore } from '@/lib/store'
import { menuData } from '@/lib/menu'
import { Icon } from '@iconify/react'
import { haptics } from '@/lib/haptics'

export default function SizeSelector() {
    const { size, setSize } = useSaladStore()

    const sizes = menuData.sizes.map((menuSize, index) => {
        const iconNames = ['mdi:leaf', 'mdi:chef-hat', 'mdi:crown']
        const descriptions = ['סלט בסיסי', 'סלט מושלם', 'סלט מפואר']

        return {
            id: menuSize.id,
            label: menuSize.label_he,
            ingredients: menuSize.veg_max,
            price: menuSize.base_price - menuData.sizes[0].base_price, // Price difference from smallest
            icon: iconNames[index] || 'mdi:leaf',
            description: descriptions[index] || 'סלט'
        }
    })

    return (
        <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="text-center mb-6">
                <motion.div
                    className="inline-flex items-center gap-2 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <Icon icon="mdi:size-select" className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold text-slate">בחר גודל סלט</h3>
                </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {sizes.map((sizeOption, index) => {
                    const isSelected = size === sizeOption.id

                    return (
                        <motion.button
                            key={sizeOption.id}
                            onClick={() => {
                                haptics.select()
                                setSize(sizeOption.id)
                            }}
                            className={`relative h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-2xl'
                                    : 'border-white/40 bg-white/60 hover:border-emerald-300/50 hover:bg-white/80 hover:shadow-lg'
                                }`}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="flex flex-col items-center justify-center h-full p-3 gap-2">
                                <motion.div
                                    className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-100' : 'bg-white/50'}`}
                                    whileHover={{ rotate: 15 }}
                                >
                                    <Icon
                                        icon={sizeOption.icon}
                                        className={`w-8 h-8 ${isSelected ? 'text-emerald-600' : 'text-slate'}`}
                                    />
                                </motion.div>

                                <div className="text-center">
                                    <div className={`text-base font-bold ${isSelected ? 'text-emerald-700' : 'text-slate'}`}>
                                        {sizeOption.label}
                                    </div>
                                    <div className="text-xs text-slate/60 mb-1">
                                        {sizeOption.ingredients} מרכיבים
                                    </div>
                                    {sizeOption.price > 0 && (
                                        <motion.div
                                            className="text-sm font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            +₪{sizeOption.price}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {isSelected && (
                                <motion.div
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="w-4 h-4 bg-white rounded-full"
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

            {size && (
                <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/50"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Icon icon="mdi:check-circle-outline" className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">
                            נבחר: {sizes.find(s => s.id === size)?.description}
                        </span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
