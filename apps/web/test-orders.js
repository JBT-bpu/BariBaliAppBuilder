#!/usr/bin/env node

/**
 * Standalone CLI test runner for order simulation
 * Run with: node test-orders.js
 */

// Mock localStorage for Node.js
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

if (typeof window === 'undefined') {
    global.localStorage = localStorageMock;
}

// Test utilities
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('\n🧪 Running Order Simulation Tests...\n');

        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);
        return this.failed === 0;
    }
}

// Mock order simulation functions
function generateMockOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TEST-${timestamp}-${random}`.toUpperCase();
}

function generateMockSlot() {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    const slotTime = new Date(now);
    slotTime.setMinutes(roundedMinutes);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    if (slotTime <= now) {
        slotTime.setHours(slotTime.getHours() + 1);
    }

    const dateStr = slotTime.toISOString().split('T')[0];
    const timeStr = slotTime.toTimeString().split(' ')[0];
    return `${dateStr}-${timeStr}`;
}

function createSampleOrder() {
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

function storeMockOrder(order) {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    orders.push(order);
    localStorage.setItem('mock_orders', JSON.stringify(orders));
}

function getMockOrders() {
    return JSON.parse(localStorage.getItem('mock_orders') || '[]');
}

function clearMockOrders() {
    localStorage.removeItem('mock_orders');
}

function getMockOrderById(orderId) {
    const orders = getMockOrders();
    return orders.find(o => o.orderId === orderId);
}

async function simulateOrderCreation(order) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const paymentId = `MOCK-PAY-${Date.now()}`;
    return {
        success: true,
        orderId: order.orderId,
        paymentId,
        status: 'pending_payment',
        message: 'Order created successfully (mock)',
    };
}

async function simulateOrderConfirmation(orderId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
        success: true,
        orderId,
        status: 'confirmed',
        message: 'Order confirmed (mock)',
    };
}

// Run tests
const runner = new TestRunner();

// Test 1: Order ID Generation
runner.test('Order ID Generation', async () => {
    const id1 = generateMockOrderId();
    const id2 = generateMockOrderId();

    if (!id1.startsWith('TEST-')) throw new Error('Invalid order ID format');
    if (id1 === id2) throw new Error('Order IDs are not unique');
});

// Test 2: Slot Generation
runner.test('Slot Generation', async () => {
    const slot = generateMockSlot();
    // Parse slot format: YYYY-MM-DD-HH:MM:SS
    const parts = slot.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const [hours, minutes, seconds] = parts[3].split(':');
    const slotTime = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
    const now = new Date();

    if (slotTime.getTime() <= now.getTime()) throw new Error('Slot time is not in future');
    if (![0, 30].includes(slotTime.getMinutes())) throw new Error('Slot not rounded to 30 minutes');
});

// Test 3: Sample Order Creation
runner.test('Sample Order Creation', async () => {
    const order = createSampleOrder();

    if (!order.orderId) throw new Error('Missing order ID');
    if (!order.size) throw new Error('Missing size');
    if (order.totals.price <= 0) throw new Error('Invalid price');
    if (order.items.veggies.length === 0) throw new Error('No vegetables in order');
});

// Test 4: Order Storage
runner.test('Order Storage', async () => {
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
});

// Test 5: Order Simulation
runner.test('Order Simulation', async () => {
    const order = createSampleOrder();

    const createResult = await simulateOrderCreation(order);
    if (!createResult.success) throw new Error('Order creation failed');
    if (!createResult.paymentId) throw new Error('No payment ID returned');

    const confirmResult = await simulateOrderConfirmation(order.orderId);
    if (!confirmResult.success) throw new Error('Order confirmation failed');
    if (confirmResult.status !== 'confirmed') throw new Error('Invalid confirmation status');
});

// Test 6: Data Validation
runner.test('Data Validation', async () => {
    const order = createSampleOrder();

    const requiredFields = ['orderId', 'size', 'items', 'totals', 'pickup_slot', 'created_at', 'status'];
    for (const field of requiredFields) {
        if (!(field in order)) throw new Error(`Missing required field: ${field}`);
    }

    const itemsFields = ['veggies', 'sauces', 'primary_extra', 'paid_additions', 'mixing'];
    for (const field of itemsFields) {
        if (!(field in order.items)) throw new Error(`Missing items field: ${field}`);
    }

    const totalsFields = ['price', 'kcal', 'protein', 'carbs', 'fat'];
    for (const field of totalsFields) {
        if (!(field in order.totals)) throw new Error(`Missing totals field: ${field}`);
    }

    if (order.totals.price <= 0) throw new Error('Invalid price');
    if (order.totals.kcal <= 0) throw new Error('Invalid kcal');
});

// Test 7: Multiple Orders
runner.test('Multiple Orders', async () => {
    clearMockOrders();

    const orders = Array.from({ length: 5 }, () => createSampleOrder());
    orders.forEach(order => storeMockOrder(order));

    const stored = getMockOrders();
    if (stored.length !== 5) throw new Error('Not all orders stored');

    const order1 = orders[0];
    const order2 = orders[1];

    const retrieved1 = getMockOrderById(order1.orderId);
    const retrieved2 = getMockOrderById(order2.orderId);

    if (retrieved1?.totals.price !== order1.totals.price) throw new Error('Order 1 integrity failed');
    if (retrieved2?.totals.price !== order2.totals.price) throw new Error('Order 2 integrity failed');

    clearMockOrders();
});

// Test 8: Order Details Display
runner.test('Order Details Display', async () => {
    const order = createSampleOrder();

    console.log('\n   📦 Sample Order Details:');
    console.log(`      Order ID: ${order.orderId}`);
    console.log(`      Size: ${order.size}ml`);
    console.log(`      Price: ₪${order.totals.price}`);
    console.log(`      Pickup: ${order.pickup_slot}`);
    console.log(`      Items: ${order.items.veggies.length} veggies, ${order.items.sauces.length} sauces`);
    console.log(`      Nutrition: ${order.totals.kcal} kcal, ${order.totals.protein}g protein`);
});

// Run all tests
runner.run().then(success => {
    process.exit(success ? 0 : 1);
});
