/**
 * Test suite for order simulation utilities
 * Run with: npm test -- testOrderSimulation.test.ts
 */

import {
    generateMockOrderId,
    createMockOrderFromStore,
    generateMockSlot,
    createSampleOrder,
    simulateOrderCreation,
    simulateOrderConfirmation,
    logOrderDetails,
    storeMockOrder,
    getMockOrders,
    clearMockOrders,
    getMockOrderById,
    type MockOrderData,
} from './testOrderSimulation';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

// Setup localStorage mock
if (typeof window === 'undefined') {
    (global as any).localStorage = localStorageMock;
}

describe('Order Simulation Utilities', () => {
    beforeEach(() => {
        clearMockOrders();
    });

    describe('generateMockOrderId', () => {
        test('should generate unique order IDs', () => {
            const id1 = generateMockOrderId();
            const id2 = generateMockOrderId();

            expect(id1).toMatch(/^TEST-/);
            expect(id2).toMatch(/^TEST-/);
            expect(id1).not.toBe(id2);
        });

        test('should have correct format', () => {
            const id = generateMockOrderId();
            expect(id).toMatch(/^TEST-[a-z0-9]+-[a-z0-9]+$/i);
        });
    });

    describe('generateMockSlot', () => {
        test('should generate valid slot format', () => {
            const slot = generateMockSlot();
            expect(slot).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}:\d{2}$/);
        });

        test('should generate future time', () => {
            const slot = generateMockSlot();
            const slotTime = new Date(slot.replace(/-/g, ':'));
            const now = new Date();

            expect(slotTime.getTime()).toBeGreaterThan(now.getTime());
        });

        test('should round to 30-minute intervals', () => {
            const slot = generateMockSlot();
            const slotTime = new Date(slot.replace(/-/g, ':'));
            const minutes = slotTime.getMinutes();

            expect([0, 30]).toContain(minutes);
        });
    });

    describe('createSampleOrder', () => {
        test('should create valid sample order', () => {
            const order = createSampleOrder();

            expect(order.orderId).toMatch(/^TEST-/);
            expect(order.size).toBe('1000');
            expect(order.totals.price).toBe(45);
            expect(order.items.veggies.length).toBeGreaterThan(0);
            expect(order.items.sauces.length).toBeGreaterThan(0);
        });

        test('should have all required fields', () => {
            const order = createSampleOrder();

            expect(order).toHaveProperty('orderId');
            expect(order).toHaveProperty('size');
            expect(order).toHaveProperty('items');
            expect(order).toHaveProperty('totals');
            expect(order).toHaveProperty('pickup_slot');
            expect(order).toHaveProperty('created_at');
            expect(order).toHaveProperty('status');
        });

        test('should have valid nutrition values', () => {
            const order = createSampleOrder();

            expect(order.totals.kcal).toBeGreaterThan(0);
            expect(order.totals.protein).toBeGreaterThan(0);
            expect(order.totals.carbs).toBeGreaterThan(0);
            expect(order.totals.fat).toBeGreaterThan(0);
        });
    });

    describe('Order Storage', () => {
        test('should store and retrieve orders', () => {
            const order = createSampleOrder();
            storeMockOrder(order);

            const orders = getMockOrders();
            expect(orders).toHaveLength(1);
            expect(orders[0].orderId).toBe(order.orderId);
        });

        test('should retrieve specific order by ID', () => {
            const order1 = createSampleOrder();
            const order2 = createSampleOrder();

            storeMockOrder(order1);
            storeMockOrder(order2);

            const retrieved = getMockOrderById(order1.orderId);
            expect(retrieved).toBeDefined();
            expect(retrieved?.orderId).toBe(order1.orderId);
        });

        test('should return undefined for non-existent order', () => {
            const order = getMockOrderById('NON-EXISTENT-ID');
            expect(order).toBeUndefined();
        });

        test('should clear all orders', () => {
            storeMockOrder(createSampleOrder());
            storeMockOrder(createSampleOrder());

            expect(getMockOrders()).toHaveLength(2);

            clearMockOrders();
            expect(getMockOrders()).toHaveLength(0);
        });
    });

    describe('Order Simulation', () => {
        test('should simulate order creation', async () => {
            const order = createSampleOrder();
            const result = await simulateOrderCreation(order);

            expect(result.success).toBe(true);
            expect(result.orderId).toBe(order.orderId);
            expect(result.paymentId).toBeDefined();
            expect(result.status).toBe('pending_payment');
        });

        test('should simulate order confirmation', async () => {
            const orderId = generateMockOrderId();
            const result = await simulateOrderConfirmation(orderId);

            expect(result.success).toBe(true);
            expect(result.orderId).toBe(orderId);
            expect(result.status).toBe('confirmed');
        });
    });

    describe('Order Data Validation', () => {
        test('should have valid order structure', () => {
            const order = createSampleOrder();

            // Validate items structure
            expect(order.items).toHaveProperty('veggies');
            expect(order.items).toHaveProperty('sauces');
            expect(order.items).toHaveProperty('primary_extra');
            expect(order.items).toHaveProperty('paid_additions');
            expect(order.items).toHaveProperty('mixing');

            // Validate totals structure
            expect(order.totals).toHaveProperty('price');
            expect(order.totals).toHaveProperty('kcal');
            expect(order.totals).toHaveProperty('protein');
            expect(order.totals).toHaveProperty('carbs');
            expect(order.totals).toHaveProperty('fat');
        });

        test('should have valid status', () => {
            const order = createSampleOrder();
            const validStatuses = ['pending_payment', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

            expect(validStatuses).toContain(order.status);
        });

        test('should have valid timestamp', () => {
            const order = createSampleOrder();
            const timestamp = new Date(order.created_at);

            expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
        });
    });

    describe('Multiple Orders', () => {
        test('should handle multiple orders', () => {
            const orders = Array.from({ length: 5 }, () => createSampleOrder());

            orders.forEach(order => storeMockOrder(order));

            const stored = getMockOrders();
            expect(stored).toHaveLength(5);
        });

        test('should maintain order integrity', () => {
            const order1 = createSampleOrder();
            const order2 = createSampleOrder();

            storeMockOrder(order1);
            storeMockOrder(order2);

            const retrieved1 = getMockOrderById(order1.orderId);
            const retrieved2 = getMockOrderById(order2.orderId);

            expect(retrieved1?.totals.price).toBe(order1.totals.price);
            expect(retrieved2?.totals.price).toBe(order2.totals.price);
        });
    });
});

// Export test runner for CLI
export async function runAllTests() {
    console.log('🧪 Running Order Simulation Tests...\n');

    const tests = [
        { name: 'Order ID Generation', fn: testOrderIdGeneration },
        { name: 'Slot Generation', fn: testSlotGeneration },
        { name: 'Sample Order Creation', fn: testSampleOrderCreation },
        { name: 'Order Storage', fn: testOrderStorage },
        { name: 'Order Simulation', fn: testOrderSimulation },
        { name: 'Data Validation', fn: testDataValidation },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            await test.fn();
            console.log(`✅ ${test.name}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${test.name}`);
            console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
            failed++;
        }
    }

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    return failed === 0;
}

async function testOrderIdGeneration() {
    const id1 = generateMockOrderId();
    const id2 = generateMockOrderId();

    if (!id1.startsWith('TEST-')) throw new Error('Invalid order ID format');
    if (id1 === id2) throw new Error('Order IDs are not unique');
}

async function testSlotGeneration() {
    const slot = generateMockSlot();
    const slotTime = new Date(slot.replace(/-/g, ':'));
    const now = new Date();

    if (slotTime.getTime() <= now.getTime()) throw new Error('Slot time is not in future');
    if (![0, 30].includes(slotTime.getMinutes())) throw new Error('Slot not rounded to 30 minutes');
}

async function testSampleOrderCreation() {
    const order = createSampleOrder();

    if (!order.orderId) throw new Error('Missing order ID');
    if (!order.size) throw new Error('Missing size');
    if (order.totals.price <= 0) throw new Error('Invalid price');
    if (order.items.veggies.length === 0) throw new Error('No vegetables in order');
}

async function testOrderStorage() {
    clearMockOrders();

    const order1 = createSampleOrder();
    const order2 = createSampleOrder();

    storeMockOrder(order1);
    storeMockOrder(order2);

    const orders = getMockOrders();
    if (orders.length !== 2) throw new Error('Orders not stored correctly');

    const retrieved = getMockOrderById(order1.orderId);
    if (!retrieved) throw new Error('Could not retrieve order');
    if (retrieved.orderId !== order1.orderId) throw new Error('Retrieved wrong order');

    clearMockOrders();
    if (getMockOrders().length !== 0) throw new Error('Orders not cleared');
}

async function testOrderSimulation() {
    const order = createSampleOrder();

    const createResult = await simulateOrderCreation(order);
    if (!createResult.success) throw new Error('Order creation failed');
    if (!createResult.paymentId) throw new Error('No payment ID returned');

    const confirmResult = await simulateOrderConfirmation(order.orderId);
    if (!confirmResult.success) throw new Error('Order confirmation failed');
    if (confirmResult.status !== 'confirmed') throw new Error('Invalid confirmation status');
}

async function testDataValidation() {
    const order = createSampleOrder();

    // Check required fields
    const requiredFields = ['orderId', 'size', 'items', 'totals', 'pickup_slot', 'created_at', 'status'];
    for (const field of requiredFields) {
        if (!(field in order)) throw new Error(`Missing required field: ${field}`);
    }

    // Check items structure
    const itemsFields = ['veggies', 'sauces', 'primary_extra', 'paid_additions', 'mixing'];
    for (const field of itemsFields) {
        if (!(field in order.items)) throw new Error(`Missing items field: ${field}`);
    }

    // Check totals structure
    const totalsFields = ['price', 'kcal', 'protein', 'carbs', 'fat'];
    for (const field of totalsFields) {
        if (!(field in order.totals)) throw new Error(`Missing totals field: ${field}`);
    }

    // Validate values
    if (order.totals.price <= 0) throw new Error('Invalid price');
    if (order.totals.kcal <= 0) throw new Error('Invalid kcal');
}
