'use client'

import { motion } from 'framer-motion'

interface WhatsAppButtonProps {
    orderId: string
    slot: string
    price: number
}

export default function WhatsAppButton({ orderId, slot, price }: WhatsAppButtonProps) {
    const whatsappUrl = `https://wa.me/972XXXXXXXXX?text=${encodeURIComponent(
        `✅ Order #${orderId} confirmed!\nPickup: ${slot}\nTotal: ₪${price}`
    )}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-14 px-6 bg-green text-white font-semibold rounded-2xl hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            📱 שלח לוואטסאפ
        </motion.a>
    )
}
