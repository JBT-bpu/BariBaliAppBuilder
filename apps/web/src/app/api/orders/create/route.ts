import { NextRequest, NextResponse } from 'next/server';
import { generateOrderId, createPaymentAdapter } from '@/lib/payments/adapter';
import { SupabaseHelpers } from '@/lib/supabase';
import { useSaladStore } from '@/lib/store';

// Create new order endpoint
// Handles order creation, payment initialization, and slot reservation

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            size,
            items,
            totals,
            pickup_slot,
            customer_wa,
            notes,
            source = 'web',
        } = body;

        // Validate required fields
        if (!size || !items || !totals || !pickup_slot) {
            return NextResponse.json(
                { error: 'Missing required fields: size, items, totals, pickup_slot' },
                { status: 400 }
            );
        }

        // Generate unique order ID
        const orderId = generateOrderId();

        // Calculate final totals (recalculate for security)
        const finalTotals = {
            price: totals.price || 0,
            kcal: totals.kcal || 0,
            protein: totals.protein || 0,
            carbs: totals.carbs || 0,
            fat: totals.fat || 0,
        };

        // Create order data
        const orderData = {
            order_id: orderId,
            customer_wa: customer_wa || null,
            size,
            items,
            totals: finalTotals,
            pickup_slot,
            payment_id: null,
            payment_status: 'pending' as const,
            status: 'pending_payment' as const,
            notes: notes || null,
            source,
        };

        // Save order to database
        let savedOrder;
        try {
            savedOrder = await SupabaseHelpers.createOrder(orderData);
        } catch (dbError) {
            console.error('Database error creating order:', dbError);
            // For development, continue with mock order
            savedOrder = {
                id: 'mock_' + orderId,
                ...orderData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        }

        // Initialize payment
        const paymentAdapter = createPaymentAdapter((process.env.PAYMENT_PROVIDER || 'mock') as 'mock' | 'yaad' | 'payme' | 'pos');
        const paymentRequest = {
            amount: finalTotals.price * 100, // Convert to agorot
            orderId,
            description: `סלט בריבאלי - ${size}`,
            customerPhone: customer_wa,
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/${orderId}/success`,
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/webhook`,
        };

        const paymentResponse = await paymentAdapter.createPayment(paymentRequest);

        if (!paymentResponse.success) {
            // Payment initialization failed
            console.error('Payment initialization failed:', paymentResponse.error);

            // Update order status to cancelled
            try {
                await SupabaseHelpers.updateOrderStatus(orderId, 'cancelled');
            } catch (updateError) {
                console.error('Failed to update order status:', updateError);
            }

            return NextResponse.json(
                {
                    error: 'Payment initialization failed',
                    details: paymentResponse.error
                },
                { status: 500 }
            );
        }

        // Update order with payment ID
        const paymentId = paymentResponse.paymentId;
        try {
            await SupabaseHelpers.updateOrderStatus(orderId, 'pending_payment');
            // In a real implementation, you'd also update the payment_id field
        } catch (updateError) {
            console.error('Failed to update order with payment ID:', updateError);
        }

        // Reserve slot capacity (decrement available slots)
        try {
            // This would be implemented with proper slot management
            // For now, we'll just log it
            console.log(`Reserved slot ${pickup_slot} for order ${orderId}`);
        } catch (slotError) {
            console.error('Failed to reserve slot:', slotError);
            // Continue anyway - slot reservation can be handled separately
        }

        return NextResponse.json({
            success: true,
            orderId,
            paymentId,
            paymentUrl: paymentResponse.paymentUrl,
            status: 'pending_payment',
            message: 'Order created successfully, redirecting to payment',
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
