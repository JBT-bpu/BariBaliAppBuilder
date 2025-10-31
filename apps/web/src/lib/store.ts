import { create } from 'zustand'
import { menuData, type MenuSize, type MenuItem } from './menu'
import {
    Macros,
    calculateTotalMacros,
    getNutritionTarget,
    getNutritionBadges
} from './nutrition'

interface SaladStore {
    // Build mode
    mode: 'saved' | 'recommended' | 'interactive' | null
    savedSaladId: string | null

    // Language
    language: 'he' | 'en'

    // Size & Limits (updated to use menu sizes)
    size: string | null // '750', '1000', '1500'
    maxIngredients: number

    // Salad composition (updated to use menu categories)
    ingredients: string[] // veggies (size-based limit)
    toppings: string[] // primary_extra (max 1)
    sauces: string[] // sauces (max 10, first 3 free)
    bread: string | null // side choice
    paidAdditions: string[] // paid_additions (max 5)

    // Legacy (for compatibility)
    protein: string | null
    extras: string[]
    dressing: string | null

    // Nutrition tracking
    nutritionTotal: Macros
    nutritionBadges: string[]

    // Last ingredient fact
    lastIngredientId: string | null

    // Metadata
    slot: string | null
    price: number
    saladName: string | null

    // Slot preferences
    favoriteSlots: string[]
    lastUsedSlot: string | null

    // Payment tracking
    paymentStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
    paymentId: string | null
    paymentUrl: string | null
    paymentError: string | null
    paymentRetryCount: number

    // Slot preference actions
    addFavoriteSlot: (slotId: string) => void
    removeFavoriteSlot: (slotId: string) => void
    setLastUsedSlot: (slotId: string) => void

    // Payment actions
    setPaymentStatus: (status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled') => void
    setPaymentId: (paymentId: string | null) => void
    setPaymentUrl: (paymentUrl: string | null) => void
    setPaymentError: (error: string | null) => void
    incrementPaymentRetry: () => void
    resetPayment: () => void

    // Actions
    setMode: (mode: 'saved' | 'recommended' | 'interactive') => void
    setLanguage: (language: 'he' | 'en') => void
    setSize: (size: string) => void
    loadSavedSalad: (saladId: string) => void
    addIngredient: (item: string) => void
    removeIngredient: (item: string) => void
    addTopping: (item: string) => void
    removeTopping: (item: string) => void
    addSauce: (item: string) => void
    removeSauce: (item: string) => void
    setBread: (bread: string | null) => void
    addPaidAddition: (item: string) => void
    removePaidAddition: (item: string) => void

    // Legacy actions (for compatibility)
    setProtein: (protein: string | null) => void
    addExtra: (item: string) => void
    removeExtra: (item: string) => void
    setDressing: (dressing: string | null) => void

    setSlot: (slot: string) => void
    setSaladName: (name: string) => void
    calculatePrice: () => void
    calculateNutrition: () => void
    reset: () => void

    // Validation
    canAddIngredient: () => boolean
    canAddTopping: () => boolean
    canAddSauce: () => boolean
    canAddPaidAddition: () => boolean
}

// Menu prices (hardcoded for now)
const prices = {
    ingredients: {
        // Base ingredients (free)
        'חסה': 0, 'כרוב קל': 0, 'תרד': 0, 'ירקות מעורבים': 0,
        // Vegetables
        'עגבנייה': 2, 'מלפפון': 2, 'גזר': 2, 'פלפל': 2, 'סלק': 2,
        // Legumes
        'חומוס': 3, 'עדשים': 3, 'פולי שעועית': 3,
        // Add-ons
        'תירס': 2, 'זיתים': 2, 'בצל אדום': 1, 'מלפפון חמוץ': 2,
        // Cheese
        'פטה': 4, 'צ׳דר': 4, 'מוצרלה': 4, 'גבינה כחולה': 5,
        // More ingredients to reach 40
        'בצל ירוק': 1, 'שום': 1, 'עשבי תיבול': 1, 'זיתי קלמטה': 3,
        'גרגירי חומוס קלויים': 4, 'אגוזי מלך': 4, 'שקדים': 4,
        'זרעי דלעת': 3, 'זרעי חמנייה': 3, 'זרעי צ׳יה': 5,
        'אבטיח': 3, 'תפוח': 3, 'אננס': 4, 'ג׳ינג׳ר': 2,
        'צ׳ילי': 1, 'כוסברה': 1, 'נענע': 1, 'בזיליקום': 1,
        'רוקט': 2, 'ארטישוק': 5, 'אספרגוס': 4, 'ברוקולי': 3,
        'כרובית': 3, 'פטריות': 3, 'תפוח אדמה': 2, 'בטטה': 3,
        'קישואים': 2, 'דלעת': 3, 'תפוז': 3, 'לימון': 2,
        'גרנולה': 4, 'פירות יבשים': 4, 'שוקולד מריר': 3,
        'דבש': 2, 'מייפל': 3, 'בלסמי': 2, 'חומץ תפוחים': 2,
        'שמן שומשום': 3, 'שמן קוקוס': 4, 'חמאה': 3, 'שמנת': 4
    },
    protein: {
        'עוף': 10, 'טונה': 12, 'טופו': 8, 'חלוומי': 11, 'ביצה': 6,
        'סלמון': 15, 'חזה הודו': 12, 'ללא חלבון': 0
    },
    extras: {
        'אבוקדו': 8, 'אגוזים': 6, 'קראנצ׳י': 4, 'זרעי צ׳יה': 5, 'כוסמת': 7
    },
    dressing: {
        'לימון זעתר': 0, 'טחינה': 0, 'בלסמי': 0, 'קיסר': 0, 'שמן זית': 0,
        'חרדל דבש': 0, 'ללא רטב': 0
    }
}

export const useSaladStore = create<SaladStore>((set, get) => ({
    // Build mode
    mode: null,
    savedSaladId: null,

    // Language (Hebrew default)
    language: 'he',

    // Size & Limits
    size: null,
    maxIngredients: 10, // default

    // Salad composition
    ingredients: [],
    toppings: [],
    sauces: [],
    bread: null,
    paidAdditions: [],

    // Legacy (for compatibility)
    protein: null,
    extras: [],
    dressing: null,

    // Nutrition tracking
    nutritionTotal: { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    nutritionBadges: [],

    // Last ingredient fact
    lastIngredientId: null,

    // Metadata
    slot: null,
    price: 0,
    saladName: null,

    // Slot preferences
    favoriteSlots: [],
    lastUsedSlot: null,

    // Payment tracking
    paymentStatus: 'idle',
    paymentId: null,
    paymentUrl: null,
    paymentError: null,
    paymentRetryCount: 0,

    setMode: (mode) => set({ mode }),

    setLanguage: (language) => set({ language }),

    setSize: (size) => set((state) => {
        const menuSize = menuData.sizes.find(s => s.id === size)
        const newState = {
            size,
            maxIngredients: menuSize ? menuSize.veg_max : 10
        }
        // Trigger price calculation after size is set
        setTimeout(() => get().calculatePrice(), 0)
        return newState
    }),

    loadSavedSalad: (saladId) => {
        // TODO: Fetch saved salad from API and populate state
        set({ savedSaladId: saladId })
    },

    addIngredient: (item) => set((state) => {
        const newIngredients = state.ingredients.includes(item) ? state.ingredients : [...state.ingredients, item]
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { ingredients: newIngredients, lastIngredientId: item }
    }),

    removeIngredient: (item) => set((state) => {
        const newIngredients = state.ingredients.filter(i => i !== item)
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { ingredients: newIngredients }
    }),

    addTopping: (item) => set((state) => {
        const newToppings = state.toppings.includes(item) ? state.toppings : [...state.toppings, item]
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { toppings: newToppings, lastIngredientId: item }
    }),

    removeTopping: (item) => set((state) => {
        const newToppings = state.toppings.filter(t => t !== item)
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { toppings: newToppings }
    }),

    addSauce: (item) => set((state) => {
        const newSauces = state.sauces.includes(item) ? state.sauces : [...state.sauces, item]
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { sauces: newSauces, lastIngredientId: item }
    }),

    removeSauce: (item) => set((state) => {
        const newSauces = state.sauces.filter(s => s !== item)
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { sauces: newSauces }
    }),

    setBread: (bread) => set({ bread }),

    addPaidAddition: (item) => set((state) => {
        const newPaidAdditions = state.paidAdditions.includes(item) ? state.paidAdditions : [...state.paidAdditions, item]
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { paidAdditions: newPaidAdditions, lastIngredientId: item }
    }),

    removePaidAddition: (item) => set((state) => {
        const newPaidAdditions = state.paidAdditions.filter(p => p !== item)
        // Trigger nutrition recalculation
        setTimeout(() => get().calculateNutrition(), 0)
        return { paidAdditions: newPaidAdditions }
    }),

    // Legacy actions (for compatibility)
    setProtein: (protein) => set({ protein }),

    addExtra: (item) => set((state) => ({
        extras: state.extras.includes(item) ? state.extras : [...state.extras, item]
    })),

    removeExtra: (item) => set((state) => ({
        extras: state.extras.filter(e => e !== item)
    })),

    setDressing: (dressing) => set({ dressing }),

    setSlot: (slot) => set({ slot }),

    setSaladName: (name) => set({ saladName: name }),

    addFavoriteSlot: (slotId) => set((state) => ({
        favoriteSlots: state.favoriteSlots.includes(slotId) ? state.favoriteSlots : [...state.favoriteSlots, slotId]
    })),

    removeFavoriteSlot: (slotId) => set((state) => ({
        favoriteSlots: state.favoriteSlots.filter(id => id !== slotId)
    })),

    setLastUsedSlot: (slotId) => set({ lastUsedSlot: slotId }),

    setPaymentStatus: (status) => set({ paymentStatus: status }),
    setPaymentId: (paymentId) => set({ paymentId }),
    setPaymentUrl: (paymentUrl) => set({ paymentUrl }),
    setPaymentError: (error) => set({ paymentError: error }),
    incrementPaymentRetry: () => set((state) => ({ paymentRetryCount: state.paymentRetryCount + 1 })),
    resetPayment: () => set({
        paymentStatus: 'idle',
        paymentId: null,
        paymentUrl: null,
        paymentError: null,
        paymentRetryCount: 0,
    }),

    calculatePrice: () => {
        const state = get()
        let total = 0

        // Base price from size
        if (state.size) {
            const menuSize = menuData.sizes.find(s => s.id === state.size)
            if (menuSize) {
                total += menuSize.base_price
            }
        }

        // Ingredients (veggies) - price deltas from menu
        state.ingredients.forEach(ingredientId => {
            const veggie = menuData.categories.find(c => c.key === 'veggies')?.items.find(i => i.id === ingredientId)
            if (veggie) {
                total += veggie.price_delta || 0
            }
        })

        // Toppings (primary_extra) - all included free
        // No additional cost for toppings

        // Sauces - first 3 free, then unit_price applies
        const saucesCategory = menuData.categories.find(c => c.key === 'sauces')
        const freeSauces = saucesCategory?.selection.included_free || 3
        state.sauces.forEach((sauceId, index) => {
            if (index >= freeSauces) {
                const sauce = saucesCategory?.items.find(i => i.id === sauceId)
                if (sauce?.unit_price) {
                    total += sauce.unit_price
                }
            }
        })

        // Bread - no additional cost (included)

        // Paid additions - unit_price applies
        const paidAdditionsCategory = menuData.categories.find(c => c.key === 'paid_additions')
        state.paidAdditions.forEach(additionId => {
            const addition = paidAdditionsCategory?.items.find(i => i.id === additionId)
            if (addition?.unit_price) {
                total += addition.unit_price
            }
        })

        set({ price: total })
    },

    calculateNutrition: () => {
        const state = get()

        // Create lookup maps for all categories
        const ingredientMap: Record<string, MenuItem> = {}
        const veggiesCategory = menuData.categories.find(c => c.key === 'veggies')
        veggiesCategory?.items.forEach(item => {
            ingredientMap[item.id] = item
        })

        const sauceMap: Record<string, MenuItem> = {}
        const saucesCategory = menuData.categories.find(c => c.key === 'sauces')
        saucesCategory?.items.forEach(item => {
            sauceMap[item.id] = item
        })

        const toppingMap: Record<string, MenuItem> = {}
        const toppingsCategory = menuData.categories.find(c => c.key === 'primary_extra')
        toppingsCategory?.items.forEach(item => {
            toppingMap[item.id] = item
        })

        const paidMap: Record<string, MenuItem> = {}
        const paidCategory = menuData.categories.find(c => c.key === 'paid_additions')
        paidCategory?.items.forEach(item => {
            paidMap[item.id] = item
        })

        // Calculate total macros from all categories
        let totalMacros = calculateTotalMacros(
            state.ingredients,
            state.sauces,
            ingredientMap,
            sauceMap
        )

        // Add toppings nutrition
        state.toppings.forEach(toppingId => {
            const topping = toppingMap[toppingId]
            if (topping?.nutrition) {
                const macros = topping.nutrition
                const grams = topping.nutrition.grams_per_scoop || 100
                totalMacros.kcal += (macros.per_100g.kcal * grams) / 100
                totalMacros.protein += (macros.per_100g.protein * grams) / 100
                totalMacros.carbs += (macros.per_100g.carbs * grams) / 100
                totalMacros.fat += (macros.per_100g.fat * grams) / 100
                totalMacros.fiber += ((macros.per_100g.fiber || 0) * grams) / 100
            }
        })

        // Add paid additions nutrition
        state.paidAdditions.forEach(paidId => {
            const paid = paidMap[paidId]
            if (paid?.nutrition) {
                const macros = paid.nutrition
                const grams = paid.nutrition.grams_per_scoop || 100
                totalMacros.kcal += (macros.per_100g.kcal * grams) / 100
                totalMacros.protein += (macros.per_100g.protein * grams) / 100
                totalMacros.carbs += (macros.per_100g.carbs * grams) / 100
                totalMacros.fat += (macros.per_100g.fat * grams) / 100
                totalMacros.fiber += ((macros.per_100g.fiber || 0) * grams) / 100
            }
        })

        // Calculate badges based on size
        const target = state.size ? getNutritionTarget(state.size) : getNutritionTarget('1000')
        const badges = getNutritionBadges(totalMacros, target)

        set({
            nutritionTotal: totalMacros,
            nutritionBadges: badges
        })
    },

    reset: () => set({
        mode: null,
        savedSaladId: null,
        size: null,
        maxIngredients: 10,
        ingredients: [],
        toppings: [],
        sauces: [],
        bread: null,
        paidAdditions: [],
        protein: null,
        extras: [],
        dressing: null,
        nutritionTotal: { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        nutritionBadges: [],
        lastIngredientId: null,
        slot: null,
        price: 0,
        saladName: null
    }),

    canAddIngredient: () => {
        const state = get()
        return state.ingredients.length < state.maxIngredients
    },

    canAddTopping: () => {
        const state = get()
        return state.toppings.length < 2
    },

    canAddSauce: () => {
        const state = get()
        const saucesCategory = menuData.categories.find(c => c.key === 'sauces')
        const maxSauces = saucesCategory?.selection.max || 10
        return state.sauces.length < maxSauces
    },

    canAddPaidAddition: () => {
        const state = get()
        return state.paidAdditions.length < 5
    }
}))
