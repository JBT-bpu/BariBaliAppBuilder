/**
 * Test Order Simulation Utilities
 * Provides functions to simulate orders for manual testing without payment processing
 */

import { useSaladStore } from './store';

export interface MockOrderData {
    orderId: string;
    size: string;
    items: {
        veggies: string[];
        sauces: string[];
        primary_extra: string[];
        paid_additions: string[];
        side?: string;
        mixing: string;
    };
    totals: {
        price: number;
        kcal: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    pickup_slot: string;
    customer_wa?: string;
    notes?: string;
    source: string;
    created_at: string;
    status: 'pending_payment' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

/**
 * Generate a mock order ID
 */
export function generateMockOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TEST-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create a mock order from current store state
 */
export function createMockOrderFromStore(): MockOrderData {
    const store = useSaladStore.getState();

    // Generate a slot if not selected
    const slot = store.slot || generateMockSlot();

    return {
        orderId: generateMockOrderId(),
        size: store.size || '1000',
        items: {
            veggies: store.ingredients,
            sauces: store.sauces,
            primary_extra: store.toppings,
            paid_additions: store.paidAdditions,
            side: store.bread || undefined,
            mixing: 'mix',
        },
        totals: {
            price: store.price,
            kcal: Math.round(store.nutritionTotal.kcal),
            protein: Math.round(store.nutritionTotal.protein),
            carbs: Math.round(store.nutritionTotal.carbs),
            fat: Math.round(store.nutritionTotal.fat),
        },
        pickup_slot: slot,
        customer_wa: undefined,
        notes: store.saladName || undefined,
        source: 'web',
        created_at: new Date().toISOString(),
        status: 'pending_payment',
    };
}

/**
 * Generate a mock pickup slot (next available time)
 */
export function generateMockSlot(): string {
    const now = new Date();
    // Round up to next 30-minute interval
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    const slotTime = new Date(now);
    slotTime.setMinutes(roundedMinutes);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    // If we've gone past the hour, add an hour
    if (slotTime <= now) {
        slotTime.setHours(slotTime.getHours() + 1);
    }

    const dateStr = slotTime.toISOString().split('T')[0];
    const timeStr = slotTime.toTimeString().split(' ')[0];
    return `${dateStr}-${timeStr}`;
}

/**
 * Create a sample order for testing
 */
export function createSampleOrder(): MockOrderData {
    return {
        orderId: generateMockOrderId(),
        size: '1000',
        items: {
            veggies: ['lettuce', 'tomato', 'cucumber', 'carrot'],
            sauces: ['tahini', 'lemon-zaatar'],
            primary_extra: ['avocado'],
            paid_additions: ['feta-cheese'],
            side: 'pita',
            mixing: 'mix',
        },
        totals: {
            price: 45,
            kcal: 380,
            protein: 18,
            carbs: 42,
            fat: 14,
        },
        pickup_slot: generateMockSlot(),
        customer_wa: undefined,
        notes: 'Sample Order',
        source: 'web',
        created_at: new Date().toISOString(),
        status: 'pending_payment',
    };
}

/**
 * Simulate order creation (for testing without real API)
 */
export async function simulateOrderCreation(orderData: MockOrderData): Promise<{
    success: boolean;
    orderId: string;
    paymentId: string;
    paymentUrl?: string;
    status: string;
    message: string;
}> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const paymentId = `MOCK-PAY-${Date.now()}`;

    return {
        success: true,
        orderId: orderData.orderId,
        paymentId,
        status: 'pending_payment',
        message: 'Order created successfully (mock)',
    };
}

/**
 * Simulate order confirmation (skip payment)
 */
export async function simulateOrderConfirmation(orderId: string): Promise<{
    success: boolean;
    orderId: string;
    status: string;
    message: string;
}> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        success: true,
        orderId,
        status: 'confirmed',
        message: 'Order confirmed (mock)',
    };
}

/**
 * Log order details to console for debugging
 */
export function logOrderDetails(order: MockOrderData): void {
    console.group('📦 Mock Order Details');
    console.log('Order ID:', order.orderId);
    console.log('Size:', order.size);
    console.log('Price: ₪' + order.totals.price);
    console.log('Pickup Slot:', order.pickup_slot);
    console.log('Items:', {
        veggies: order.items.veggies.length,
        sauces: order.items.sauces.length,
        toppings: order.items.primary_extra.length,
        paid_additions: order.items.paid_additions.length,
    });
    console.log('Nutrition:', {
        kcal: order.totals.kcal,
        protein: order.totals.protein + 'g',
        carbs: order.totals.carbs + 'g',
        fat: order.totals.fat + 'g',
    });
    console.log('Full Order:', order);
    console.groupEnd();
}

/**
 * Store mock order in localStorage for testing
 */
export function storeMockOrder(order: MockOrderData): void {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    orders.push(order);
    localStorage.setItem('mock_orders', JSON.stringify(orders));
    console.log(`✅ Mock order ${order.orderId} stored in localStorage`);
}

/**
 * Retrieve all mock orders from localStorage
 */
export function getMockOrders(): MockOrderData[] {
    return JSON.parse(localStorage.getItem('mock_orders') || '[]');
}

/**
 * Clear all mock orders from localStorage
 */
export function clearMockOrders(): void {
    localStorage.removeItem('mock_orders');
    console.log('🗑️ All mock orders cleared');
}

/**
 * Get a mock order by ID
 */
export function getMockOrderById(orderId: string): MockOrderData | undefined {
    const orders = getMockOrders();
    return orders.find(o => o.orderId === orderId);
}

/**
 * Console commands for testing
 * Usage in browser console:
 * - window.__testOrder.createFromStore()
 * - window.__testOrder.createSample()
 * - window.__testOrder.logOrders()
 * - window.__testOrder.clearOrders()
 */
export function initTestCommands(): void {
    if (typeof window !== 'undefined') {
        (window as any).__testOrder = {
            createFromStore: () => {
                const order = createMockOrderFromStore();
                logOrderDetails(order);
                storeMockOrder(order);
                return order;
            },
            createSample: () => {
                const order = createSampleOrder();
                logOrderDetails(order);
                storeMockOrder(order);
                return order;
            },
            logOrders: () => {
                const orders = getMockOrders();
                console.table(orders);
                return orders;
            },
            clearOrders: () => {
                clearMockOrders();
            },
            getOrder: (id: string) => {
                const order = getMockOrderById(id);
                if (order) logOrderDetails(order);
                return order;
            },
            help: () => {
                console.log(`
🧪 Test Order Simulation Commands:
  __testOrder.createFromStore()  - Create order from current store state
  __testOrder.createSample()     - Create a sample order
  __testOrder.logOrders()        - Show all stored mock orders
  __testOrder.getOrder(id)       - Get specific order by ID
  __testOrder.clearOrders()      - Clear all mock orders
                `);
            }
        };
        console.log('✅ Test order commands available. Type: __testOrder.help()');
    }
}
