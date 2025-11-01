'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ConfettiSimple } from '@/components/ui/Confetti';
import { useSaladStore } from '@/lib/store';
import { getMockOrderById } from '@/lib/testOrderSimulation';
import { cn } from '@/lib/utils';

interface OrderDetails {
    orderId: string;
    pickupTime: string;
    items: {
        veggies: string[];
        sauces: string[];
        paid_additions: string[];
        side?: string;
    };
    totals: {
        price: number;
        kcal: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    status: string;
}

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { reset } = useSaladStore();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Try to fetch from demo orders first (for demo mode testing)
                let demoOrders: any[] = [];
                if (typeof window !== 'undefined') {
                    demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
                }
                const demoOrder = demoOrders.find((o: any) => o.orderId === orderId);

                if (demoOrder) {
                    // Convert demo order to display format
                    const displayOrder: OrderDetails = {
                        orderId: demoOrder.orderId,
                        pickupTime: new Date(demoOrder.pickup_slot.replace(/-/g, ':')).toLocaleString('he-IL'),
                        items: {
                            veggies: demoOrder.items.veggies,
                            sauces: demoOrder.items.sauces,
                            paid_additions: demoOrder.items.paid_additions,
                            side: demoOrder.items.side,
                        },
                        totals: demoOrder.totals,
                        status: demoOrder.status,
                    };
                    setOrderDetails(displayOrder);
                } else {
                    // Try to fetch from test orders (for manual testing)
                    const testOrder = getMockOrderById(orderId);

                    if (testOrder) {
                        // Convert test order to display format
                        const displayOrder: OrderDetails = {
                            orderId: testOrder.orderId,
                            pickupTime: new Date(testOrder.pickup_slot.replace(/-/g, ':')).toLocaleString('he-IL'),
                            items: {
                                veggies: testOrder.items.veggies,
                                sauces: testOrder.items.sauces,
                                paid_additions: testOrder.items.paid_additions,
                                side: testOrder.items.side,
                            },
                            totals: testOrder.totals,
                            status: testOrder.status,
                        };
                        setOrderDetails(displayOrder);
                    } else {
                        // In production, fetch from your API
                        // For now, show error for non-test orders
                        setError('לא נמצאה הזמנה עם מספר זה. אנא בדוק את מספר ההזמנה.');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                setError('לא הצלחנו לטעון את פרטי ההזמנה');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const handleWhatsAppShare = () => {
        if (!orderDetails) return;

        const message = `🎉 הזמנה ${orderDetails.orderId} מוכנה!

🕐 זמן איסוף: ${orderDetails.pickupTime}

🥗 הרכב הסלט:
${orderDetails.items.veggies.map(item => `• ${item}`).join('\n')}
${orderDetails.items.sauces.map(item => `• ${item}`).join('\n')}
${orderDetails.items.paid_additions.map(item => `• ${item}`).join('\n')}

💰 סה״כ: ₪${orderDetails.totals.price}

תודה שבחרת בבריבאלי! 🌱`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleSaveAsUsual = () => {
        // Save current salad configuration to localStorage
        const currentSalad = {
            ingredients: orderDetails?.items.veggies || [],
            sauces: orderDetails?.items.sauces || [],
            paidAdditions: orderDetails?.items.paid_additions || [],
            side: orderDetails?.items.side,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem('baribali_usual_salad', JSON.stringify(currentSalad));

        // Show success message
        alert('הסלט נשמר כהרגל שלך! 🎉');
    };

    const handleOrderAgain = () => {
        // Reset the store and go back to builder
        reset();
        router.push('/interactive-builder');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center p-6">
                <div className="max-w-md w-full space-y-6">
                    <LoadingSkeleton variant="circular" width={80} height={80} className="mx-auto" />
                    <div className="space-y-3">
                        <LoadingSkeleton variant="text" width="80%" height={24} className="mx-auto" />
                        <LoadingSkeleton variant="text" width="60%" height={20} className="mx-auto" />
                    </div>
                    <div className="space-y-2">
                        <LoadingSkeleton variant="rectangular" height={100} />
                        <LoadingSkeleton variant="rectangular" height={60} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <ErrorBoundary>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                שגיאה בטעינת ההזמנה
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Button onClick={() => router.push('/')}>
                                חזור לדף הבית
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg">
            {/* Confetti Celebration */}
            <ConfettiSimple isActive={!loading && !error && !!orderDetails} />

            <div className="max-w-md mx-auto p-6">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        ההזמנה בוצעה בהצלחה! 🎉
                    </h1>
                    <p className="text-gray-600">
                        מספר הזמנה: <span className="font-mono font-medium">{orderDetails.orderId}</span>
                    </p>
                </div>

                {/* Pickup Time */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-800">זמן איסוף</h3>
                            <p className="text-green-700">{orderDetails.pickupTime}</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg border p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">סיכום ההזמנה</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">ירקות:</span>
                            <span>{orderDetails.items.veggies.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">רטבים:</span>
                            <span>{orderDetails.items.sauces.join(', ')}</span>
                        </div>
                        {orderDetails.items.paid_additions.length > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">תוספות:</span>
                                <span>{orderDetails.items.paid_additions.join(', ')}</span>
                            </div>
                        )}
                        {orderDetails.items.side && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">צד:</span>
                                <span>{orderDetails.items.side}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t mt-3 pt-3">
                        <div className="flex justify-between items-center font-semibold">
                            <span>סה״כ לתשלום:</span>
                            <span className="text-green">₪{orderDetails.totals.price}</span>
                        </div>
                    </div>
                </div>

                {/* Nutrition Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">ערכים תזונתיים</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>קלוריות: {Math.round(orderDetails.totals.kcal)}</div>
                        <div>חלבון: {Math.round(orderDetails.totals.protein)}g</div>
                        <div>פחמימות: {Math.round(orderDetails.totals.carbs)}g</div>
                        <div>שומנים: {Math.round(orderDetails.totals.fat)}g</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button onClick={handleWhatsAppShare} className="w-full" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                        שלח בוואטסאפ
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleSaveAsUsual}>
                            שמור כהרגל
                        </Button>
                        <Button variant="outline" onClick={handleOrderAgain}>
                            הזמן שוב
                        </Button>
                    </div>

                    <Button variant="ghost" onClick={() => router.push('/')} className="w-full">
                        חזור לדף הבית
                    </Button>
                </div>
            </div>
        </div>
    );
}
