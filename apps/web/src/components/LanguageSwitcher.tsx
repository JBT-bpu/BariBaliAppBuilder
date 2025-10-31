'use client'

import { motion } from 'framer-motion'
import { useSaladStore } from '@/lib/store'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
    const { language, setLanguage } = useSaladStore()

    const toggleLanguage = () => {
        setLanguage(language === 'he' ? 'en' : 'he')
    }

    return (
        <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Languages className="w-4 h-4 text-slate" />
            <span className="text-sm font-medium text-slate">
                {language === 'he' ? 'EN' : 'עב'}
            </span>
        </motion.button>
    )
}
