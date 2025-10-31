# Test Order Simulation Guide

## Overview

The application now includes built-in test order simulation utilities that allow you to manually test the order flow without going through real payment processing.

## Getting Started

### 1. Start the Development Server

The dev server is already running at `http://localhost:3000`

### 2. Open Browser Console

Open your browser's developer tools (F12 or Cmd+Option+I) and go to the **Console** tab.

You should see a message: `✅ Test order commands available. Type: __testOrder.help()`

## Available Commands

All test commands are available through the `__testOrder` object in the browser console.

### `__testOrder.help()`
Displays all available commands and their descriptions.

```javascript
__testOrder.help()
```

### `__testOrder.createFromStore()`
Creates a mock order from the current application state (whatever salad you've built).

```javascript
__testOrder.createFromStore()
```

**Returns:** A mock order object with:
- Order ID (TEST-xxxxx format)
- Current salad size, ingredients, sauces, toppings, paid additions
- Calculated price and nutrition values
- Auto-generated pickup slot (next 30-minute interval)
- Timestamp

**Use case:** After building a salad in the UI, use this to create an order from that exact configuration.

### `__testOrder.createSample()`
Creates a pre-configured sample order for quick testing.

```javascript
__testOrder.createSample()
```

**Sample includes:**
- Size: 1000ml
- Ingredients: lettuce, tomato, cucumber, carrot
- Sauces: tahini, lemon-zaatar
- Toppings: avocado
- Paid additions: feta cheese
- Price: ₪45
- Nutrition: 380 kcal, 18g protein, 42g carbs, 14g fat

**Use case:** Quick testing without building a salad manually.

### `__testOrder.logOrders()`
Displays all stored mock orders in a table format.

```javascript
__testOrder.logOrders()
```

**Returns:** Array of all mock orders stored in localStorage

**Use case:** Review all orders you've created during testing.

### `__testOrder.getOrder(id)`
Retrieves and displays a specific order by ID.

```javascript
__testOrder.getOrder('TEST-xxxxx')
```

**Use case:** Look up details of a specific test order.

### `__testOrder.clearOrders()`
Clears all stored mock orders from localStorage.

```javascript
__testOrder.clearOrders()
```

**Use case:** Clean up test data between testing sessions.

## Testing Workflow

### Scenario 1: Test Complete Order Flow

1. **Navigate to the salad builder**
   - Go to `http://localhost:3000/interactive-builder`

2. **Build a salad**
   - Select size
   - Add ingredients
   - Add sauces
   - Add toppings
   - Add paid additions

3. **Create an order from your salad**
   ```javascript
   const order = __testOrder.createFromStore()
   ```

4. **Review the order details**
   - Check the console output for order ID, price, nutrition values
   - Verify all your selections are captured correctly

5. **Check stored orders**
   ```javascript
   __testOrder.logOrders()
   ```

### Scenario 2: Quick Testing with Sample Order

1. **Create a sample order**
   ```javascript
   __testOrder.createSample()
   ```

2. **Review the order**
   - Check console for order details
   - Verify price and nutrition calculations

3. **Test order confirmation flow**
   - Navigate to `/order/[orderId]/success` with the test order ID
   - Example: `http://localhost:3000/order/TEST-xxxxx/success`

### Scenario 3: Test Multiple Orders

1. **Create several orders**
   ```javascript
   __testOrder.createSample()
   __testOrder.createFromStore()
   __testOrder.createSample()
   ```

2. **View all orders**
   ```javascript
   __testOrder.logOrders()
   ```

3. **Find a specific order**
   ```javascript
   __testOrder.getOrder('TEST-xxxxx')
   ```

## Order Data Structure

Each mock order contains:

```javascript
{
  orderId: "TEST-xxxxx",           // Unique order identifier
  size: "1000",                    // Salad size in ml
  items: {
    veggies: [],                   // Selected vegetables
    sauces: [],                    // Selected sauces
    primary_extra: [],             // Selected toppings
    paid_additions: [],            // Paid add-ons
    side: "pita",                  // Bread/side choice
    mixing: "mix"                  // Mixing preference
  },
  totals: {
    price: 45,                     // Price in NIS
    kcal: 380,                     // Calories
    protein: 18,                   // Protein in grams
    carbs: 42,                     // Carbs in grams
    fat: 14                        // Fat in grams
  },
  pickup_slot: "2025-10-29-18:00", // Pickup date and time
  customer_wa: undefined,          // WhatsApp number (optional)
  notes: "Sample Order",           // Order notes
  source: "web",                   // Order source
  created_at: "2025-10-29T...",   // Creation timestamp
  status: "pending_payment"        // Order status
}
```

## Troubleshooting

### Commands not available?
- Make sure you're in the browser console (F12)
- Refresh the page (Ctrl+R or Cmd+R)
- Check that the message "✅ Test order commands available" appears in the console

### Order not being created?
- Ensure you've built a salad before using `createFromStore()`
- Check the console for any error messages
- Try `createSample()` instead

### Can't find an order?
- Use `__testOrder.logOrders()` to see all stored orders
- Copy the exact order ID and use `getOrder(id)`
- Check browser localStorage is enabled

## Notes

- All test orders are stored in browser localStorage
- Test orders persist across page refreshes
- Clearing localStorage will delete all test orders
- Test orders are NOT sent to the backend (no real orders created)
- Use `clearOrders()` to clean up between testing sessions

## Next Steps

After creating test orders:

1. **Test the checkout flow** - Navigate through the checkout steps
2. **Test order confirmation** - Visit the success page with a test order ID
3. **Test error handling** - Try invalid order IDs or missing data
4. **Test responsive design** - Resize browser and test on different screen sizes
5. **Check console for errors** - Look for any JavaScript errors or warnings

---

**Happy Testing! 🧪**
