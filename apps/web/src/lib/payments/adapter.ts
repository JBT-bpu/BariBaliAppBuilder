// Payment adapter interface for Bari Bali salad ordering
// Supports multiple payment providers (YaadPay, PayMe, POS systems)

export interface PaymentRequest {
    amount: number; // Amount in agorot (1/100 of shekel)
    orderId: string;
    description?: string;
    customerEmail?: string;
    customerPhone?: string;
    returnUrl?: string;
    webhookUrl?: string;
}

export interface PaymentResponse {
    success: boolean;
    paymentId?: string;
    paymentUrl?: string;
    error?: string;
    transactionId?: string;
}

export interface WebhookPayload {
    paymentId: string;
    orderId: string;
    amount: number;
    status: 'completed' | 'failed' | 'pending' | 'cancelled';
    transactionId?: string;
    timestamp: string;
    signature?: string; // For webhook verification
}

export interface PaymentAdapter {
    /**
     * Initialize payment and return payment URL
     */
    createPayment(request: PaymentRequest): Promise<PaymentResponse>;

    /**
     * Verify webhook signature and process payment update
     */
    verifyWebhook(payload: WebhookPayload, signature?: string): Promise<boolean>;

    /**
     * Get payment status
     */
    getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'cancelled'>;

    /**
     * Refund payment (if supported)
     */
    refundPayment?(paymentId: string, amount?: number): Promise<boolean>;
}

// Factory function to create payment adapter based on provider
export function createPaymentAdapter(provider: 'mock' | 'yaad' | 'payme' | 'pos'): PaymentAdapter {
    switch (provider) {
        case 'mock':
            return new MockPaymentAdapter();
        case 'yaad':
            return new YaadPaymentAdapter();
        case 'payme':
            return new PayMePaymentAdapter();
        case 'pos':
            return new POSPaymentAdapter();
        default:
            throw new Error(`Unsupported payment provider: ${provider}`);
    }
}

// Mock payment adapter for development and testing
class MockPaymentAdapter implements PaymentAdapter {
    private payments = new Map<string, { status: string; orderId: string; amount: number }>();

    async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const paymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store payment for later verification
        this.payments.set(paymentId, {
            status: 'pending',
            orderId: request.orderId,
            amount: request.amount,
        });

        // Mock payment URL (would normally redirect to payment processor)
        const paymentUrl = `https://mock-payment-processor.com/pay/${paymentId}`;

        return {
            success: true,
            paymentId,
            paymentUrl,
        };
    }

    async verifyWebhook(payload: WebhookPayload): Promise<boolean> {
        // Mock webhook verification - always succeed for demo
        const payment = this.payments.get(payload.paymentId);
        if (!payment) return false;

        // Update payment status
        payment.status = payload.status;

        return true;
    }

    async getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'cancelled'> {
        const payment = this.payments.get(paymentId);
        if (!payment) return 'failed';

        return payment.status as 'pending' | 'completed' | 'failed' | 'cancelled';
    }

    async refundPayment(paymentId: string): Promise<boolean> {
        // Mock refund - always succeed
        return true;
    }
}

// YaadPay adapter (Israeli payment processor)
class YaadPaymentAdapter implements PaymentAdapter {
    private apiKey: string;
    private terminalId: string;

    constructor(apiKey?: string, terminalId?: string) {
        this.apiKey = apiKey || process.env.YAAD_API_KEY || '';
        this.terminalId = terminalId || process.env.YAAD_TERMINAL_ID || '';
    }

    async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
        // Implementation would integrate with YaadPay API
        // This is a placeholder for the actual implementation
        throw new Error('YaadPay integration not implemented yet');
    }

    async verifyWebhook(payload: WebhookPayload, signature?: string): Promise<boolean> {
        // Verify YaadPay webhook signature
        if (!signature) return false;

        // Implementation would verify signature using YaadPay's signing method
        return true;
    }

    async getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'cancelled'> {
        // Query YaadPay API for payment status
        throw new Error('YaadPay status check not implemented yet');
    }
}

// PayMe adapter (Israeli mobile payment)
class PayMePaymentAdapter implements PaymentAdapter {
    async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
        // Implementation would integrate with PayMe API
        throw new Error('PayMe integration not implemented yet');
    }

    async verifyWebhook(payload: WebhookPayload, signature?: string): Promise<boolean> {
        // Verify PayMe webhook signature
        return true;
    }

    async getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'cancelled'> {
        // Query PayMe API for payment status
        throw new Error('PayMe status check not implemented yet');
    }
}

// POS system adapter (for in-store payments)
class POSPaymentAdapter implements PaymentAdapter {
    async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
        // For POS systems, payment might be handled differently
        // Could generate a QR code or send to POS terminal
        throw new Error('POS integration not implemented yet');
    }

    async verifyWebhook(payload: WebhookPayload): Promise<boolean> {
        // POS systems might not use webhooks
        return true;
    }

    async getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'cancelled'> {
        // POS payments are typically immediate
        return 'completed';
    }
}

// Utility functions
export function formatAmountForPayment(amountInAgorot: number): string {
    // Convert agorot to shekels for display
    return (amountInAgorot / 100).toFixed(2);
}

export function parseAmountFromPayment(amountString: string): number {
    // Convert shekel string back to agorot
    return Math.round(parseFloat(amountString) * 100);
}

export function generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
