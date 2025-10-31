'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSaladStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { translations } from '@/lib/translations'

export default function SizeSelectorPage() {
    const router = useRouter()
    const { setSize, setLanguage, language } = useSaladStore()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    const t = (key: string) => translations[language][key as keyof typeof translations.he] || key

    const sizes = [
        {
            id: '750',
            label: '750ml',
            he: 'קטן',
            description: 'Perfect for light lunch',
            heDescription: 'אידיאלי לארוחת צהריים קלה',
            price: '₪29',
            features: ['12 ירקות', 'רטב אחד', 'ללא תוספות']
        },
        {
            id: '1000',
            label: '1000ml',
            he: 'בינוני',
            description: 'Most popular choice',
            heDescription: 'הבחירה הפופולרית ביותר',
            price: '₪39',
            features: ['14 ירקות', '3 רטבים', 'תוספת אחת']
        },
        {
            id: '1500',
            label: '1500ml',
            he: 'גדול',
            description: 'For hearty appetite',
            heDescription: 'לתיאבון גדול',
            price: '₪49',
            features: ['16 ירקות', '5 רטבים', '2 תוספות']
        }
    ]

    const handleSelectSize = (sizeId: string) => {
        setSelectedSize(sizeId)
        setSize(sizeId)
        setTimeout(() => {
            router.push('/interactive-builder')
        }, 300)
    }

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Header */}
            <motion.div
                className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-white/20 px-4 py-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <motion.button
                            className="p-2 rounded-xl bg-slate/10 hover:bg-slate/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight className="w-5 h-5 text-slate" />
                        </motion.button>
                    </Link>
                    <h1 className="text-lg font-bold text-ink">
                        {language === 'he' ? 'בחר גודל' : 'Choose Size'}
                    </h1>
                    <LanguageSwitcher />
                </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-md mx-auto space-y-4">
                    {/* Title */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-ink mb-2">
                            {language === 'he' ? 'בחר את הגודל המתאים לך' : 'Select Your Perfect Size'}
                        </h2>
                        <p className="text-sm text-ink/70">
                            {language === 'he' ? 'כל גודל כולל מספר שונה של ירקות ורטבים' : 'Each size includes different vegetables and dressings'}
                        </p>
                    </motion.div>

                    {/* Size Cards */}
                    <div className="space-y-3">
                        {sizes.map((size, index) => (
                            <motion.button
                                key={size.id}
                                onClick={() => handleSelectSize(size.id)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedSize === size.id
                                        ? 'border-green bg-green/10 shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-green/50'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-ink">
                                            {language === 'he' ? size.he : size.label}
                                        </h3>
                                        <p className="text-xs text-ink/60 mt-1">
                                            {language === 'he' ? size.heDescription : size.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-green">{size.price}</div>
                                        <div className="text-xs text-ink/60">{size.label}</div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-1 pt-3 border-t border-gray-100">
                                    {size.features.map((feature, i) => (
                                        <div key={i} className="text-xs text-ink/70 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green rounded-full"></span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                {/* Selection Indicator */}
                                {selectedSize === size.id && (
                                    <motion.div
                                        className="absolute top-3 right-3 w-6 h-6 bg-green rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Info Box */}
                    <motion.div
                        className="mt-8 p-4 bg-lemon/10 rounded-xl border border-lemon/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-xs text-ink/70 text-center">
                            {language === 'he'
                                ? '💡 בחר גודל כדי להתחיל לבנות את הסלט שלך'
                                : '💡 Select a size to start building your salad'}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
