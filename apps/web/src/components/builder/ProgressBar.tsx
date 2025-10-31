'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Leaf, Beef, Cookie, Droplets, Clock, CreditCard } from 'lucide-react'

const steps = [
    { path: '/ingredients', label: 'מרכיבים', icon: Leaf },
    { path: '/protein', label: 'חלבון', icon: Beef },
    { path: '/toppings', label: 'תוספות', icon: Cookie },
    { path: '/dressing', label: 'רטב', icon: Droplets },
    { path: '/slot', label: 'זמן', icon: Clock },
    { path: '/payment', label: 'תשלום', icon: CreditCard },
]

export default function ProgressBar() {
    const pathname = usePathname()
    const currentStepIndex = steps.findIndex(step => pathname.includes(step.path))

    const progress = ((currentStepIndex + 1) / steps.length) * 100

    return (
        <div className="w-full px-4 py-2">
            <div className="flex justify-between items-center mb-2">
                {steps.map((step, index) => (
                    <div key={step.path} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index <= currentStepIndex
                                ? 'bg-green text-white'
                                : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span className="text-xs mt-1 text-slate">{step.label}</span>
                    </div>
                ))}
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-lemon rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-0 text-lg"
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    🍋
                </motion.div>
            </div>
        </div>
    )
}
