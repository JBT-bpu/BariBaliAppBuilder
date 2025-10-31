'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { haptics } from '@/lib/haptics'
import { useSaladStore } from '@/lib/store'

interface SaveSaladModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (name: string) => void
}

export default function SaveSaladModal({ isOpen, onClose, onSave }: SaveSaladModalProps) {
    const [saladName, setSaladName] = useState('')
    const { saladName: currentName } = useSaladStore()

    const handleSave = () => {
        if (saladName.trim()) {
            haptics.success()
            onSave(saladName.trim())
            setSaladName('')
            onClose()
        }
    }

    const handleSkip = () => {
        haptics.tap()
        setSaladName('')
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm border border-white/20 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                className="mb-6 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-fit mx-auto"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <Icon icon="mdi:content-save-outline" className="w-12 h-12 text-blue-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-slate mb-3">שמור סלט זה</h2>
                            <p className="text-slate/70 text-sm leading-relaxed">תוכל להזמין אותו שוב בקלות בעתיד</p>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate mb-3">
                                שם הסלט
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={saladName}
                                    onChange={(e) => setSaladName(e.target.value)}
                                    placeholder="לדוגמה: הסלט האהוב שלי"
                                    className="w-full h-14 px-5 bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:border-blue-400 focus:bg-white/90 focus:outline-none transition-all duration-300 text-slate placeholder:text-slate/50 shadow-lg"
                                    maxLength={50}
                                />
                                <Icon icon="mdi:edit-outline" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate/40" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <motion.button
                                onClick={handleSkip}
                                className="flex-1 h-14 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-semibold rounded-2xl shadow-lg hover:from-slate-500 hover:to-slate-600 transition-all"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                דלג
                            </motion.button>
                            <motion.button
                                onClick={handleSave}
                                disabled={!saladName.trim()}
                                className={`flex-1 h-14 font-semibold rounded-2xl shadow-lg transition-all ${saladName.trim()
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                whileHover={{ scale: saladName.trim() ? 1.02 : 1, y: saladName.trim() ? -1 : 0 }}
                                whileTap={{ scale: saladName.trim() ? 0.98 : 1 }}
                            >
                                שמור
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
