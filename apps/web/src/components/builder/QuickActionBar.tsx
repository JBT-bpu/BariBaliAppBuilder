'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { haptics } from '@/lib/haptics'

interface QuickActionBarProps {
    protein: string | null
    dressing: string | null
    proteinOptions: string[]
    dressingOptions: string[]
    onProteinSelect: (protein: string) => void
    onDressingSelect: (dressing: string) => void
    onClear: () => void
    onRandom: () => void
}

export default function QuickActionBar({
    protein,
    dressing,
    proteinOptions,
    dressingOptions,
    onProteinSelect,
    onDressingSelect,
    onClear,
    onRandom
}: QuickActionBarProps) {
    return (
        <div className="p-4 space-y-6">
            {/* Protein Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate mb-3 flex items-center gap-2">
                    <Icon icon="mdi:food-steak" className="w-5 h-5 text-amber-600" />
                    חלבון
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {proteinOptions.map((prot, index) => {
                        const isSelected = protein === prot
                        return (
                            <motion.button
                                key={prot}
                                onClick={() => {
                                    haptics.tap()
                                    onProteinSelect(prot)
                                }}
                                className={`w-full h-12 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${isSelected
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-white/80 backdrop-blur-sm border border-white/20 text-slate hover:bg-white/90 hover:shadow-md'
                                    }`}
                                style={{
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: isSelected
                                        ? '0 8px 24px rgba(245, 158, 11, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.06)'
                                }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate">{prot}</span>
                                    {isSelected && (
                                        <motion.div
                                            className="flex items-center gap-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Icon icon="mdi:check" className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Dressing Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate mb-3 flex items-center gap-2">
                    <Icon icon="mdi:cup-water" className="w-5 h-5 text-blue-600" />
                    רטב
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {dressingOptions.map((dress, index) => {
                        const isSelected = dressing === dress
                        return (
                            <motion.button
                                key={dress}
                                onClick={() => {
                                    haptics.tap()
                                    onDressingSelect(dress)
                                }}
                                className={`w-full h-12 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${isSelected
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-white/80 backdrop-blur-sm border border-white/20 text-slate hover:bg-white/90 hover:shadow-md'
                                    }`}
                                style={{
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: isSelected
                                        ? '0 8px 24px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.06)'
                                }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate">{dress}</span>
                                    {isSelected && (
                                        <motion.div
                                            className="flex items-center gap-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Icon icon="mdi:check" className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <motion.button
                    onClick={() => {
                        haptics.select()
                        onRandom()
                    }}
                    className="w-full h-12 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Icon icon="mdi:dice-multiple-outline" className="w-4 h-4" />
                    <span>סלט אקראי</span>
                </motion.button>

                <motion.button
                    onClick={() => {
                        haptics.tap()
                        onClear()
                    }}
                    className="w-full h-12 px-4 rounded-2xl bg-slate/10 backdrop-blur-sm border border-white/20 text-slate font-semibold text-sm hover:bg-slate/20 transition-all flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Icon icon="mdi:refresh" className="w-4 h-4" />
                    <span>נקה הכל</span>
                </motion.button>
            </div>

            {/* Quick Stats */}
            <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="text-center">
                    <div className="text-xs text-slate/60 mb-1">סיכום מהיר</div>
                    <div className="text-sm font-medium text-slate">
                        {protein ? '✓ חלבון' : '✗ חלבון'}
                    </div>
                    <div className="text-sm font-medium text-slate">
                        {dressing ? '✓ רטב' : '✗ רטב'}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
