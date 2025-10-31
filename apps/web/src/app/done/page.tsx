'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSaladStore } from '@/lib/store'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function DonePage() {
    const { slot, price, reset } = useSaladStore()
    const [orderId, setOrderId] = useState('')

    useEffect(() => {
        // Generate order ID
        const id = Math.random().toString(36).substr(2, 9).toUpperCase()
        setOrderId(id)
        // TODO: save order to backend
    }, [])

    const eta = '15 minutes' // TODO: calculate based on slot

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                <motion.div
                    className="text-6xl mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
                >
                    ✅
                </motion.div>
                <motion.h1
                    className="text-3xl font-bold text-slate mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Order Confirmed!
                </motion.h1>
                <motion.p
                    className="text-lg text-slate mb-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Your salad is being prepared with love.
                </motion.p>

                <motion.div
                    className="bg-white rounded-2xl p-6 mb-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green mb-2">Order #{orderId}</div>
                        <div className="text-slate">Pickup Time: {slot}</div>
                        <div className="text-slate">ETA: {eta}</div>
                        <div className="text-slate">Total: ₪{price}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-4"
                >
                    <WhatsAppButton orderId={orderId} slot={slot || ''} price={price} />

                    <Link href="/">
                        <motion.button
                            className="w-full h-14 bg-slate text-white font-semibold rounded-2xl text-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={reset}
                        >
                            Order Another Salad
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}
