'use client'

import { motion } from 'framer-motion'
import { useSaladStore } from '@/lib/store'
import { translations } from '@/lib/translations'
import { sounds } from '@/lib/sounds'
import { haptics } from '@/lib/haptics'
import { Icon } from '@iconify/react'

export default function BreadSelector() {
    const { bread, setBread, language } = useSaladStore()
    const t = (key: string) => translations[language][key as keyof typeof translations.he] || key

    const breadOptions = [
        {
            id: 'bread' as const,
            label: t('bread'),
            icon: 'noto:bread',
            price: 0
        },
        {
            id: 'cubes' as const,
            label: t('croutons'),
            icon: 'openmoji_croutons',
            price: 2
        }
    ]

    const handleBreadSelect = (breadType: 'bread' | 'cubes') => {
        if (bread === breadType) {
            setBread(null)
            sounds.tap.play()
            haptics.tap()
        } else {
            setBread(breadType)
            sounds.plop.play()
            haptics.success()
        }
    }

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
                    <Icon icon="mdi:bread-slice-outline" className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate">{t('choose_bread_addition')}</h3>
                </motion.div>
                <p className="text-sm text-slate/60">{t('optional_leave_empty')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {breadOptions.map((option, index) => {
                    const isSelected = bread === option.id

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => handleBreadSelect(option.id)}
                            className={`relative h-20 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected
                                    ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl'
                                    : 'border-white/40 bg-white/60 hover:border-amber-300/50 hover:bg-white/80 hover:shadow-lg'
                                }`}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="flex items-center justify-center h-full p-4 gap-4">
                                <motion.div
                                    className={`p-2 rounded-xl ${isSelected ? 'bg-amber-100' : 'bg-white/50'}`}
                                    whileHover={{ rotate: 5 }}
                                >
                                    <Icon
                                        icon={option.icon}
                                        className={`w-10 h-10 ${isSelected ? 'text-amber-600' : 'text-slate'}`}
                                    />
                                </motion.div>
                                <div className="text-center flex-1">
                                    <div className={`text-base font-bold ${isSelected ? 'text-amber-700' : 'text-slate'}`}>
                                        {option.label}
                                    </div>
                                    {option.price > 0 && (
                                        <motion.div
                                            className="text-sm font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full mt-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            +₪{option.price}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {isSelected && (
                                <motion.div
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
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
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    ease: 'easeInOut'
                                }}
                            />
                        </motion.button>
                    )
                })}
            </div>
        </motion.div>
    )
}
