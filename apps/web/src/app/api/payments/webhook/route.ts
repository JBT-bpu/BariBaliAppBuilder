import { NextRequest, NextResponse } from 'next/server';
import { createPaymentAdapter } from '@/lib/payments/adapter';
import { useSaladStore } from '@/lib/store';

// Webhook endpoint for payment provider callbacks
// Handles payment status updates from YaadPay, PayMe, etc.

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const signature = request.headers.get('x-signature') || '';

        // Extract payment details from webhook payload
        const {
            paymentId,
            orderId,
            amount,
            status,
            transactionId,
            timestamp,
        } = body;

        // Validate required fields
        if (!paymentId || !orderId || !status) {
            console.error('Missing required webhook fields:', { paymentId, orderId, status });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get payment provider from environment or determine from paymentId
        const provider = process.env.PAYMENT_PROVIDER || 'mock';
        const adapter = createPaymentAdapter(provider as any);

        // Verify webhook signature (if supported by provider)
        const isValid = await adapter.verifyWebhook({
            paymentId,
            orderId,
            amount,
            status,
            transactionId,
            timestamp,
            signature,
        }, signature);

        if (!isValid) {
            console.error('Invalid webhook signature for payment:', paymentId);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Update payment status in database/store
        // In a real app, you'd update a database here
        console.log(`Payment ${paymentId} status updated to: ${status}`);

        // For demo purposes, we'll simulate updating the store
        // In production, you'd emit an event or update database
        if (status === 'completed') {
            // Trigger order fulfillment process
            console.log(`Order ${orderId} payment completed - ready for fulfillment`);

            // Could send notification to kitchen, update order status, etc.
        } else if (status === 'failed') {
            console.log(`Payment ${paymentId} failed - notifying customer`);
            // Could send failure notification, retry logic, etc.
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: `Payment ${paymentId} status updated to ${status}`,
        });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint for payment status polling (fallback for providers without webhooks)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
        return NextResponse.json(
            { error: 'Missing paymentId parameter' },
            { status: 400 }
        );
    }

    try {
        const provider = process.env.PAYMENT_PROVIDER || 'mock';
        const adapter = createPaymentAdapter(provider as any);

        const status = await adapter.getPaymentStatus(paymentId);

        return NextResponse.json({
            paymentId,
            status,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status' },
            { status: 500 }
        );
    }
}
