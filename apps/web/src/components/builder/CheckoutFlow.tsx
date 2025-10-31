'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useSaladStore } from '@/lib/store';
import { SlotPicker } from './SlotPicker';
import { SaladMixingAnimation } from './SaladMixingAnimation';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { formatAmountForPayment } from '@/lib/payments/adapter';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';

interface CheckoutFlowProps {
    onOrderComplete?: (orderId: string) => void;
    onBack?: () => void;
    className?: string;
}

export function CheckoutFlow({ onOrderComplete, onBack, className }: CheckoutFlowProps) {
    const [currentStep, setCurrentStep] = useState<'slot' | 'confirm' | 'mixing' | 'payment'>('slot');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showMixingAnimation, setShowMixingAnimation] = useState(false);
    const [demoMode] = useState(true); // Demo mode enabled for testing

    const {
        slot,
        setSlot,
        price,
        calculatePrice,
        ingredients,
        sauces,
        bread,
        paidAdditions,
        size,
        nutritionTotal,
    } = useSaladStore();

    // Recalculate price when component mounts
    useEffect(() => {
        calculatePrice();
    }, [calculatePrice]);

    const handleSlotSelect = (slotId: string) => {
        haptics.success()
        setSlot(slotId);
        setCurrentStep('confirm');
    };

    const handleConfirmOrder = () => {
        haptics.select()
        setShowMixingAnimation(true);
    };

    const handleMixingComplete = () => {
        setShowMixingAnimation(false);
        setCurrentStep('payment');
    };

    const handlePayment = async () => {
        if (!slot) {
            setError('אנא בחר זמן איסוף');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Prepare order data
            const orderData = {
                size,
                items: {
                    veggies: ingredients,
                    sauces,
                    primary_extra: [], // TODO: Add primary extras
                    paid_additions: paidAdditions,
                    side: bread || undefined,
                    mixing: 'mix', // TODO: Add mixing preference
                },
                totals: {
                    price,
                    kcal: nutritionTotal.kcal,
                    protein: nutritionTotal.protein,
                    carbs: nutritionTotal.carbs,
                    fat: nutritionTotal.fat,
                },
                pickup_slot: slot,
                customer_wa: null, // TODO: Add WhatsApp integration
                notes: '',
                source: 'web',
            };

            if (demoMode) {
                // Demo mode: simulate successful payment
                await new Promise(resolve => setTimeout(resolve, 1500));
                const demoOrderId = `DEMO-${Date.now()}`;

                // Store demo order for success page
                if (typeof window !== 'undefined') {
                    const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
                    demoOrders.push({
                        orderId: demoOrderId,
                        ...orderData,
                        created_at: new Date().toISOString(),
                        status: 'confirmed',
                    });
                    localStorage.setItem('demo_orders', JSON.stringify(demoOrders));
                }

                onOrderComplete?.(demoOrderId);
                return;
            }

            // Create order via API
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create order');
            }

            // Redirect to payment URL
            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                // For development, simulate success
                onOrderComplete?.(result.orderId);
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'שגיאה בעיבוד התשלום');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { key: 'slot', label: 'זמן איסוף', icon: 'mdi:clock-outline' },
            { key: 'confirm', label: 'אישור', icon: 'mdi:check-circle-outline' },
            { key: 'payment', label: 'תשלום', icon: 'mdi:credit-card-outline' }
        ] as const;

        return (
            <motion.div
                className="flex items-center justify-center mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.key;
                        const isCompleted = (
                            (step.key === 'slot' && ['confirm', 'payment'].includes(currentStep)) ||
                            (step.key === 'confirm' && currentStep === 'payment')
                        );

                        return (
                            <React.Fragment key={step.key}>
                                <motion.div
                                    className={cn(
                                        'relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300',
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg'
                                            : isCompleted
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent'
                                                : 'bg-white/80 backdrop-blur-sm border-white/40 text-slate/60'
                                    )}
                                    whileHover={{ scale: 1.05 }}
                                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                                >
                                    {isCompleted ? (
                                        <Icon icon="mdi:check" className="w-5 h-5" />
                                    ) : (
                                        <Icon icon={step.icon} className="w-5 h-5" />
                                    )}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-white/30"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <motion.div
                                        className={cn(
                                            'w-12 h-0.5 transition-colors duration-300',
                                            isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/40'
                                        )}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: index * 0.2, duration: 0.5 }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    const renderSlotStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    בחר זמן איסוף
                </h2>
                <p className="text-gray-600">
                    מתי תרצה לאסוף את הסלט שלך?
                </p>
            </div>

            <ErrorBoundary>
                <SlotPicker
                    selectedSlot={slot || undefined}
                    onSlotSelect={handleSlotSelect}
                />
            </ErrorBoundary>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    חזור
                </Button>
            </div>
        </div>
    );

    const renderConfirmStep = () => {
        const selectedSlotTime = slot ? new Date(slot.split('-').slice(1).join('-').replace(/-/g, ':')) : null;

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        אישור הזמנה
                    </h2>
                    <p className="text-gray-600">
                        אנא בדוק את פרטי ההזמנה
                    </p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">גודל:</span>
                        <span className="font-medium">{size}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">רכיבים:</span>
                        <span className="font-medium">{ingredients.length} פריטים</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">רטבים:</span>
                        <span className="font-medium">{sauces.length} רטבים</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">תוספות:</span>
                        <span className="font-medium">{paidAdditions.length} תוספות</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">זמן איסוף:</span>
                        <span className="font-medium">
                            {selectedSlotTime ? selectedSlotTime.toLocaleString('he-IL') : 'לא נבחר'}
                        </span>
                    </div>

                    <div className="border-t pt-3">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>סה״כ לתשלום:</span>
                            <span className="text-green">₪{price}</span>
                        </div>
                    </div>
                </div>

                {/* Nutrition Summary */}
                <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">ערכים תזונתיים</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>קלוריות: {Math.round(nutritionTotal.kcal)}</div>
                        <div>חלבון: {Math.round(nutritionTotal.protein)}g</div>
                        <div>פחמימות: {Math.round(nutritionTotal.carbs)}g</div>
                        <div>שומנים: {Math.round(nutritionTotal.fat)}g</div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep('slot')} className="flex-1">
                        חזור לבחירת זמן
                    </Button>
                    <Button
                        onClick={handleConfirmOrder}
                        className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        🥗 בה לי
                    </Button>
                </div>
            </div>
        );
    };

    const renderPaymentStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    תשלום
                </h2>
                <p className="text-gray-600">
                    סכום לתשלום: ₪{price}
                </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">כרטיס אשראי</div>
                            <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                        </div>
                        <div className="w-5 h-5 bg-green rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep('confirm')} className="flex-1">
                    חזור לאישור
                </Button>
                <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1"
                >
                    {isProcessing ? (
                        <>
                            <LoadingSkeleton variant="text" width={60} height={16} className="mr-2" />
                            מעבד...
                        </>
                    ) : (
                        `שלם ₪${price}`
                    )}
                </Button>
            </div>
        </div>
    );

    const stepVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const getStepDirection = (step: string) => {
        const steps = ['slot', 'confirm', 'payment'];
        return steps.indexOf(step);
    };

    return (
        <>
            <motion.div
                className={cn('max-w-md mx-auto bg-white/95 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden', className)}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {renderStepIndicator()}

                <div className="px-6 pb-6">
                    <AnimatePresence mode="wait" custom={getStepDirection(currentStep)}>
                        <motion.div
                            key={currentStep}
                            custom={getStepDirection(currentStep)}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.3 }
                            }}
                        >
                            {currentStep === 'slot' && renderSlotStep()}
                            {currentStep === 'confirm' && renderConfirmStep()}
                            {currentStep === 'payment' && renderPaymentStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Salad Mixing Animation Overlay */}
            <SaladMixingAnimation
                isVisible={showMixingAnimation}
                onComplete={handleMixingComplete}
            />
        </>
    );
}
