'use client';

import { useRouter } from 'next/navigation';
import { CheckoutFlow } from '@/components/builder/CheckoutFlow';
import { motion } from 'framer-motion';

export default function SlotPage() {
    const router = useRouter();

    const handleOrderComplete = (orderId: string) => {
        // Navigate to success page with order ID
        router.push(`/order/${orderId}/success`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-cream via-white to-lemon flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <CheckoutFlow
                onOrderComplete={handleOrderComplete}
                onBack={handleBack}
            />
        </motion.div>
    );
}
