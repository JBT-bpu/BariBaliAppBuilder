import { NutritionData, MenuItem } from './menu'

export interface Macros {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface NutritionTargets {
    kcal: number;
    protein: { min: number; max: number };
    carbs: { min: number; max: number };
    fat: { min: number; max: number };
}

// Default nutrition targets by size
export const NUTRITION_TARGETS: Record<string, NutritionTargets> = {
    '750': {
        kcal: 500,
        protein: { min: 20, max: 35 },
        carbs: { min: 40, max: 80 },
        fat: { min: 15, max: 30 }
    },
    '1000': {
        kcal: 650,
        protein: { min: 25, max: 40 },
        carbs: { min: 50, max: 90 },
        fat: { min: 20, max: 35 }
    },
    '1500': {
        kcal: 800,
        protein: { min: 30, max: 45 },
        carbs: { min: 60, max: 100 },
        fat: { min: 25, max: 40 }
    }
}

// Default grams per scoop for items without nutrition data
export const DEFAULT_SCOOP_GRAMS: Record<string, number> = {
    // Vegetables
    leafy: 25,      // lettuce, baby leaves, herbs
    crunchy: 30,    // tomato, cucumber, bell pepper, carrot, radish
    hearty: 35,     // cabbage, celery, mushrooms
    // Grains/Legumes
    grain: 50,      // quinoa, rice, bulgur, pasta, lentils, chickpeas
    // Proteins
    protein: 40,    // egg, tuna, tofu
    // Fats
    fat: 15,        // olives, seeds
    // Sauces
    sauce: 10       // per squeeze/serving
}

// Get default grams for an item based on its category/type
export function getDefaultGrams(item: MenuItem): number {
    const id = item.id.toLowerCase()

    // Vegetables
    if (['lettuce', 'baby_leaf', 'cilantro', 'parsley'].includes(id)) return DEFAULT_SCOOP_GRAMS.leafy
    if (['tomato', 'cucumber', 'bell_pepper', 'carrot', 'radish'].includes(id)) return DEFAULT_SCOOP_GRAMS.crunchy
    if (['cabbage_white', 'cabbage_purple', 'celery', 'mushrooms'].includes(id)) return DEFAULT_SCOOP_GRAMS.hearty

    // Grains/Legumes
    if (['quinoa', 'brown_rice', 'bulgur', 'fusilli_pasta', 'black_lentils', 'green_lentils', 'mung_beans', 'chickpeas'].includes(id)) return DEFAULT_SCOOP_GRAMS.grain

    // Proteins
    if (['egg', 'tuna', 'tofu_olive_oil', 'feta5', 'baby_mozzarella'].includes(id)) return DEFAULT_SCOOP_GRAMS.protein

    // Fats
    if (['black_olives', 'green_olives', 'sunflower_seeds', 'sesame', 'chia', 'zaatar'].includes(id)) return DEFAULT_SCOOP_GRAMS.fat

    // Sauces
    if (item.unit_price !== undefined) return DEFAULT_SCOOP_GRAMS.sauce

    return 30 // fallback
}

// Calculate macros for a single scoop of an ingredient
export function calculateMacrosForScoop(item: MenuItem): Macros {
    const nutrition = item.nutrition
    if (!nutrition) {
        // Use category-based defaults if no nutrition data
        return getDefaultMacrosForItem(item)
    }

    const grams = nutrition.grams_per_scoop
    const per100g = nutrition.per_100g
    const factor = grams / 100

    return {
        kcal: Math.round(per100g.kcal * factor),
        protein: Math.round(per100g.protein * factor * 10) / 10,
        carbs: Math.round(per100g.carbs * factor * 10) / 10,
        fat: Math.round(per100g.fat * factor * 10) / 10,
        fiber: Math.round((per100g.fiber || 0) * factor * 10) / 10
    }
}

// Get default macros for items without nutrition data
export function getDefaultMacrosForItem(item: MenuItem): Macros {
    const grams = getDefaultGrams(item)
    const id = item.id.toLowerCase()

    // Category-based defaults (rough but sensible estimates)
    if (['lettuce', 'baby_leaf', 'cilantro', 'parsley'].includes(id)) {
        // Leafy greens: ~15 kcal/100g, mostly water
        return {
            kcal: Math.round(15 * grams / 100),
            protein: Math.round(1.4 * grams / 100 * 10) / 10,
            carbs: Math.round(2.9 * grams / 100 * 10) / 10,
            fat: Math.round(0.2 * grams / 100 * 10) / 10,
            fiber: Math.round(1.3 * grams / 100 * 10) / 10
        }
    }

    if (['tomato', 'cucumber', 'bell_pepper', 'carrot', 'radish'].includes(id)) {
        // Crunchy veggies: ~20 kcal/100g
        return {
            kcal: Math.round(20 * grams / 100),
            protein: Math.round(1.0 * grams / 100 * 10) / 10,
            carbs: Math.round(4.0 * grams / 100 * 10) / 10,
            fat: Math.round(0.2 * grams / 100 * 10) / 10,
            fiber: Math.round(1.5 * grams / 100 * 10) / 10
        }
    }

    if (['cabbage_white', 'cabbage_purple', 'celery', 'mushrooms'].includes(id)) {
        // Hearty veggies: ~25 kcal/100g
        return {
            kcal: Math.round(25 * grams / 100),
            protein: Math.round(1.5 * grams / 100 * 10) / 10,
            carbs: Math.round(5.0 * grams / 100 * 10) / 10,
            fat: Math.round(0.3 * grams / 100 * 10) / 10,
            fiber: Math.round(2.0 * grams / 100 * 10) / 10
        }
    }

    if (['quinoa', 'brown_rice', 'bulgur', 'fusilli_pasta', 'black_lentils', 'green_lentils', 'mung_beans', 'chickpeas'].includes(id)) {
        // Grains/legumes: ~60 kcal/100g (higher energy density)
        return {
            kcal: Math.round(60 * grams / 100),
            protein: Math.round(4.0 * grams / 100 * 10) / 10,
            carbs: Math.round(12.0 * grams / 100 * 10) / 10,
            fat: Math.round(1.5 * grams / 100 * 10) / 10,
            fiber: Math.round(2.5 * grams / 100 * 10) / 10
        }
    }

    if (['egg', 'tuna', 'tofu_olive_oil', 'feta5', 'baby_mozzarella'].includes(id)) {
        // Proteins: ~140 kcal/100g (higher protein density)
        return {
            kcal: Math.round(140 * grams / 100),
            protein: Math.round(12.0 * grams / 100 * 10) / 10,
            carbs: Math.round(1.5 * grams / 100 * 10) / 10,
            fat: Math.round(9.0 * grams / 100 * 10) / 10,
            fiber: 0
        }
    }

    if (['black_olives', 'green_olives', 'sunflower_seeds', 'sesame', 'chia', 'zaatar'].includes(id)) {
        // Fats/seeds: ~50 kcal/100g (high fat content)
        return {
            kcal: Math.round(50 * grams / 100),
            protein: Math.round(2.0 * grams / 100 * 10) / 10,
            carbs: Math.round(3.0 * grams / 100 * 10) / 10,
            fat: Math.round(4.5 * grams / 100 * 10) / 10,
            fiber: Math.round(1.5 * grams / 100 * 10) / 10
        }
    }

    // Sauces - vary by type
    if (item.unit_price !== undefined) {
        if (['olive_oil'].includes(id)) {
            // High fat sauces
            return {
                kcal: Math.round(884 * grams / 100),
                protein: 0,
                carbs: 0,
                fat: Math.round(100 * grams / 100 * 10) / 10,
                fiber: 0
            }
        }
        if (['tahini', 'pesto', 'caesar'].includes(id)) {
            // Medium fat sauces
            return {
                kcal: Math.round(50 * grams / 100),
                protein: Math.round(2.0 * grams / 100 * 10) / 10,
                carbs: Math.round(3.0 * grams / 100 * 10) / 10,
                fat: Math.round(4.5 * grams / 100 * 10) / 10,
                fiber: 0
            }
        }
        // Low cal sauces (lemon, vinegar, etc.)
        return {
            kcal: Math.round(15 * grams / 100),
            protein: Math.round(0.5 * grams / 100 * 10) / 10,
            carbs: Math.round(3.0 * grams / 100 * 10) / 10,
            fat: 0,
            fiber: 0
        }
    }

    // Fallback for unknown items
    return {
        kcal: Math.round(25 * grams / 100),
        protein: Math.round(1.5 * grams / 100 * 10) / 10,
        carbs: Math.round(4.0 * grams / 100 * 10) / 10,
        fat: Math.round(0.5 * grams / 100 * 10) / 10,
        fiber: Math.round(1.0 * grams / 100 * 10) / 10
    }
}

// Add two macro objects
export function addMacros(a: Macros, b: Macros): Macros {
    return {
        kcal: a.kcal + b.kcal,
        protein: a.protein + b.protein,
        carbs: a.carbs + b.carbs,
        fat: a.fat + b.fat,
        fiber: a.fiber + b.fiber
    }
}

// Calculate total macros from selected ingredients
export function calculateTotalMacros(
    ingredients: string[],
    sauces: string[],
    ingredientMap: Record<string, MenuItem>,
    sauceMap: Record<string, MenuItem>
): Macros {
    let total: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }

    // Add ingredients
    ingredients.forEach(ingredientId => {
        const item = ingredientMap[ingredientId]
        if (item) {
            const macros = calculateMacrosForScoop(item)
            total = addMacros(total, macros)
        }
    })

    // Add sauces
    sauces.forEach(sauceId => {
        const item = sauceMap[sauceId]
        if (item) {
            const macros = calculateMacrosForScoop(item)
            total = addMacros(total, macros)
        }
    })

    return total
}

// Get nutrition target for a given size
export function getNutritionTarget(size: string): NutritionTargets {
    return NUTRITION_TARGETS[size] || NUTRITION_TARGETS['1000']
}

// Check if macros meet certain criteria for badges
export function getNutritionBadges(macros: Macros, target: NutritionTargets): string[] {
    const badges: string[] = []

    if (macros.protein >= target.protein.min) {
        badges.push('High Protein')
    }

    if (macros.carbs <= target.carbs.max) {
        badges.push('Low Carb')
    }

    if (macros.fiber >= 8) {
        badges.push('Fiber+')
    }

    // Check for vegan (no animal products - this would need more sophisticated logic)
    // For now, just check if protein is from plant sources
    if (macros.protein >= target.protein.min && macros.fat < target.fat.max) {
        badges.push('Balanced')
    }

    return badges
}

// Get random nutrition fact for an item
export function getRandomNutritionFact(item: MenuItem, language: 'he' | 'en' = 'he'): string | null {
    if (!item.facts || item.facts.length === 0) {
        // Fallback to generic facts based on item type
        return getGenericNutritionFact(item, language)
    }
    const randomIndex = Math.floor(Math.random() * item.facts.length)
    return item.facts[randomIndex][language] || item.facts[randomIndex].he || item.facts[randomIndex].en
}

// Get generic nutrition fact when no specific facts are available
export function getGenericNutritionFact(item: MenuItem, language: 'he' | 'en' = 'he'): string | null {
    const id = item.id.toLowerCase()

    const genericFacts = {
        he: {
            leafy: "עלים ירוקים = סיבים ומינרלים",
            crunchy: "ירק קראנצ'י עם ויטמינים",
            hearty: "ירק מלא ברכיבי תזונה",
            grain: "דגן מלא = אנרגיה איטית",
            protein: "חלבון רזה לשובע מהיר",
            fat: "שומן בריא מהטבע",
            sauce: "כף אחת = טעם גדול"
        },
        en: {
            leafy: "Leafy greens rich in fiber & minerals",
            crunchy: "Crunchy veg packed with vitamins",
            hearty: "Nutrient-dense hearty vegetable",
            grain: "Whole grain for sustained energy",
            protein: "Lean protein for quick satiety",
            fat: "Healthy natural fats",
            sauce: "One spoon = big flavor"
        }
    }

    // Determine category
    if (['lettuce', 'baby_leaf', 'cilantro', 'parsley'].includes(id)) return genericFacts[language].leafy
    if (['tomato', 'cucumber', 'bell_pepper', 'carrot', 'radish'].includes(id)) return genericFacts[language].crunchy
    if (['cabbage_white', 'cabbage_purple', 'celery', 'mushrooms'].includes(id)) return genericFacts[language].hearty
    if (['quinoa', 'brown_rice', 'bulgur', 'fusilli_pasta', 'black_lentils', 'green_lentils', 'mung_beans', 'chickpeas'].includes(id)) return genericFacts[language].grain
    if (['egg', 'tuna', 'tofu_olive_oil', 'feta5', 'baby_mozzarella'].includes(id)) return genericFacts[language].protein
    if (['black_olives', 'green_olives', 'sunflower_seeds', 'sesame', 'chia', 'zaatar'].includes(id)) return genericFacts[language].fat
    if (item.unit_price !== undefined) return genericFacts[language].sauce

    return genericFacts[language].leafy // fallback
}
