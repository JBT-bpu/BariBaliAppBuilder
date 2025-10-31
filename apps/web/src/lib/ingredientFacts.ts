// Ingredient health facts and benefits - MUST match menu.ts IDs exactly
export interface IngredientFact {
    icon: string
    fact: string
    benefit: string
}

export const ingredientFacts: Record<string, IngredientFact> = {
    // Vegetables - matching menu.ts IDs exactly
    'lettuce': {
        icon: 'noto:leafy-green',
        fact: 'עשיר בסיבים → טוב לעיכול',
        benefit: 'Digestion'
    },
    'baby_leaf': {
        icon: 'noto:leafy-green',
        fact: 'עלים רכים וטריים → עשירים בנוטריינטים',
        benefit: 'Nutrients'
    },
    'tomato': {
        icon: 'noto:tomato',
        fact: 'עשיר בליקופן → טוב ללב וכלי דם',
        benefit: 'Heart Health'
    },
    'cucumber': {
        icon: 'twemoji:cucumber',
        fact: 'מרטיב ומרענן → עוזר להידרציה',
        benefit: 'Hydration'
    },
    'bell_pepper': {
        icon: 'noto:bell-pepper',
        fact: 'עשיר בוויטמין C → חיזוק חיסון',
        benefit: 'Immunity'
    },
    'black_lentils': {
        icon: 'openmoji:lentils',
        fact: 'עשיר בחלבון וברזל → אנרגיה',
        benefit: 'Energy & Protein'
    },
    'green_lentils': {
        icon: 'openmoji:lentils',
        fact: 'עשיר בחלבון → טוב לשרירים',
        benefit: 'Muscle Building'
    },
    'mung_beans': {
        icon: 'noto:peanuts',
        fact: 'עשיר בחלבון צמחי → קל לעיכול',
        benefit: 'Plant Protein'
    },
    'carrot': {
        icon: 'noto:carrot',
        fact: 'עשיר בוויטמין A → עוזר לעור וראייה',
        benefit: 'Skin & Vision'
    },
    'quinoa': {
        icon: 'openmoji:quinoa',
        fact: 'חלבון מלא צמחי → כל חומצות אמינו',
        benefit: 'Complete Protein'
    },
    'brown_rice': {
        icon: 'openmoji:brown-rice',
        fact: 'עשיר בסיבים → משביע וטעים',
        benefit: 'Satiety'
    },
    'bulgur': {
        icon: 'openmoji:bulgur',
        fact: 'עשיר בסיבים וחלבון → בריאות',
        benefit: 'Fiber & Protein'
    },
    'roasted_eggplant': {
        icon: 'noto:eggplant',
        fact: 'נמוך בקלוריות → עשיר בנוטריינטים',
        benefit: 'Low Calorie'
    },
    'chickpeas': {
        icon: 'openmoji:chickpeas',
        fact: 'עשיר בחלבון וסיבים → משביע',
        benefit: 'Protein & Fiber'
    },
    'baked_sweet_potato': {
        icon: 'openmoji:sweet-potato',
        fact: 'עשיר בביטא קרוטן → טוב לעור',
        benefit: 'Skin Glow'
    },
    'baked_potato': {
        icon: 'noto:potato',
        fact: 'עשיר בפוטסיום → מווסת לחץ דם',
        benefit: 'Blood Pressure'
    },
    'sprouts': {
        icon: 'openmoji:seedling',
        fact: 'חי וטרי → עשיר בנוטריינטים',
        benefit: 'Live Nutrients'
    },
    'green_peas': {
        icon: 'noto:peanuts',
        fact: 'עשיר בחלבון וסיבים → משביע',
        benefit: 'Protein & Fiber'
    },
    'corn': {
        icon: 'noto:ear-of-corn',
        fact: 'עשיר בלוטאין → הגנה על עיניים',
        benefit: 'Eye Health'
    },
    'cabbage_white': {
        icon: 'openmoji:cabbage',
        fact: 'עשיר בנוטריינטים → טוב לעיכול',
        benefit: 'Gut Health'
    },
    'cabbage_purple': {
        icon: 'openmoji:cabbage',
        fact: 'אנתוציאנים → אנטיאוקסידנט חזק',
        benefit: 'Antioxidant'
    },
    'mushrooms': {
        icon: 'noto:mushroom',
        fact: 'עשיר בוויטמין D → חיזוק עצמות',
        benefit: 'Bone Strength'
    },
    'red_onion': {
        icon: 'noto:onion',
        fact: 'עשיר בקוורצטין → אנטיאוקסידנט',
        benefit: 'Antioxidant'
    },
    'green_onion': {
        icon: 'noto:onion',
        fact: 'טרי וחריף → טוב לעיכול',
        benefit: 'Digestion'
    },
    'radish': {
        icon: 'twemoji:radish',
        fact: 'חריף וטרי → עוזר לעיכול',
        benefit: 'Digestion Aid'
    },
    'kohlrabi': {
        icon: 'openmoji:cabbage',
        fact: 'עשיר בוויטמין C → חיזוק חיסון',
        benefit: 'Immunity'
    },
    'celery': {
        icon: 'noto:leafy-green',
        fact: 'נמוך בקלוריות → טוב לדיאטה',
        benefit: 'Weight Management'
    },
    'fusilli_pasta': {
        icon: 'noto:spaghetti',
        fact: 'פחמימות מורכבות → אנרגיה ממושכת',
        benefit: 'Sustained Energy'
    },
    'cilantro': {
        icon: 'noto:herb',
        fact: 'עוזר לניקוי גוף → עשיר בנוטריינטים',
        benefit: 'Detox Support'
    },
    'parsley': {
        icon: 'noto:herb',
        fact: 'עשיר בוויטמינים → טוב לבריאות',
        benefit: 'Vitamin Rich'
    },
    'pickles': {
        icon: 'twemoji:cucumber',
        fact: 'פרוביוטיקה טבעית → בריאות מעי',
        benefit: 'Gut Probiotic'
    },
    'hot_pepper': {
        icon: 'noto:hot-pepper',
        fact: 'קפסאיצין → מגביר חילוף חומרים',
        benefit: 'Metabolism Boost'
    },
    'cranberries': {
        icon: 'openmoji:cranberries',
        fact: 'אנטיאוקסידנט חזק → בריאות',
        benefit: 'Antioxidant Power'
    },
    'black_olives': {
        icon: 'noto:olive',
        fact: 'עשיר בשומנים בריאים → טוב ללב',
        benefit: 'Heart Healthy'
    },
    'green_olives': {
        icon: 'noto:olive',
        fact: 'עשיר בנוטריינטים → טעם עמוק',
        benefit: 'Flavor & Health'
    },
    'sunflower_seeds': {
        icon: 'openmoji:sunflower-seeds',
        fact: 'עשיר בוויטמין E → אנטיאוקסידנט',
        benefit: 'Antioxidant'
    },
    'sesame': {
        icon: 'openmoji:sesame',
        fact: 'עשיר בסידן → טוב לעצמות',
        benefit: 'Bone Support'
    },
    'chia': {
        icon: 'openmoji:seedling',
        fact: 'עשיר באומגה 3 וסיבים → בריאות',
        benefit: 'Superfood'
    },
    'zaatar': {
        icon: 'openmoji:seedling',
        fact: 'תיבול בריא → טעם עמוק',
        benefit: 'Flavor & Health'
    },
    'fresh_beet': {
        icon: 'openmoji:beet',
        fact: 'עשיר בביטאינים → משפר זרימת דם',
        benefit: 'Blood Flow'
    },

    // Sauces
    'olive_oil': {
        icon: 'openmoji:olive-oil',
        fact: 'שומן חד-בלעדי בריא → טוב ללב',
        benefit: 'Heart Healthy'
    },
    'lemon_juice': {
        icon: 'noto:lemon',
        fact: 'וויטמין C טבעי → חיזוק חיסון',
        benefit: 'Immunity'
    },
    'thousand_island': {
        icon: 'openmoji:mayonnaise',
        fact: 'רוטב קלאסי → טעם עמוק',
        benefit: 'Classic Flavor'
    },
    'garlic': {
        icon: 'noto:garlic',
        fact: 'עשיר באליסין → חיזוק חיסון',
        benefit: 'Immunity Boost'
    },
    'citrus_vinaigrette': {
        icon: 'noto:lemon',
        fact: 'הדרים טריים → וויטמין C',
        benefit: 'Citrus Boost'
    },
    'tahini': {
        icon: 'openmoji:tahini',
        fact: 'עשיר בסידן וחלבון → חוזק',
        benefit: 'Protein & Calcium'
    },
    'pesto': {
        icon: 'openmoji:pesto',
        fact: 'בזיליקום טרי → אנטיבקטריאלי',
        benefit: 'Antibacterial'
    },
    'zhug': {
        icon: 'twemoji:hot-pepper',
        fact: 'ירוק טרי וחריף → טעם עמוק',
        benefit: 'Fresh & Spicy'
    },
    'balsamic': {
        icon: 'openmoji:balsamic-vinegar',
        fact: 'עשיר בנוטריינטים → טעם עמוק',
        benefit: 'Flavor & Health'
    },
    'sweet_chili': {
        icon: 'twemoji:hot-pepper',
        fact: 'מתוק וחריף → טעם מאוזן',
        benefit: 'Balanced Flavor'
    },
    'teriyaki': {
        icon: 'openmoji:soy-sauce',
        fact: 'סויה אסייתית → טעם עמוק',
        benefit: 'Asian Flavor'
    },
    'soy': {
        icon: 'openmoji:soy-sauce',
        fact: 'סויה סיני → טעם אותנטי',
        benefit: 'Authentic Taste'
    },
    'caesar': {
        icon: 'openmoji:caesar-dressing',
        fact: 'קלאסי ועשיר → טעם מעולה',
        benefit: 'Premium Taste'
    },

    // Primary extras
    'egg': {
        icon: 'noto:egg',
        fact: 'חלבון מושלם → כל חומצות אמינו',
        benefit: 'Complete Protein'
    },
    'tuna': {
        icon: 'noto:fish',
        fact: 'חלבון רזה → אומגה 3 בריא',
        benefit: 'Lean Protein'
    },
    'tofu_olive_oil': {
        icon: 'fluent-emoji-flat:tofu',
        fact: 'חלבון צמחי → קל לעיכול',
        benefit: 'Plant Protein'
    },
    'feta5': {
        icon: 'noto:cheese-wedge',
        fact: 'גבינה קלה → עשירה בפרוביוטיקה',
        benefit: 'Gut Probiotic'
    },
    'baby_mozzarella': {
        icon: 'noto:cheese-wedge',
        fact: 'גבינה קלה → חלבון טוב',
        benefit: 'Lean Protein'
    },

    // Paid additions
    'egg_paid': {
        icon: 'noto:egg',
        fact: 'חלבון מושלם → כל חומצות אמינו',
        benefit: 'Complete Protein'
    },
    'feta_paid': {
        icon: 'noto:cheese-wedge',
        fact: 'עשירה בפרוביוטיקה → בריאות מעי',
        benefit: 'Gut Probiotic'
    },
    'tuna_paid': {
        icon: 'noto:fish',
        fact: 'חלבון רזה → אומגה 3 בריא',
        benefit: 'Lean Protein'
    },
    'tofu_teriyaki_paid': {
        icon: 'fluent-emoji-flat:tofu',
        fact: 'חלבון צמחי → טעם אסייתי',
        benefit: 'Plant Protein'
    },
    'halloumi_paid': {
        icon: 'noto:cheese-wedge',
        fact: 'גבינה עשירה בחלבון → חוזק',
        benefit: 'Protein & Calcium'
    },
    'parmesan_paid': {
        icon: 'noto:cheese-wedge',
        fact: 'גבינה חזקה → טעם עמוק',
        benefit: 'Premium Flavor'
    },
    'honey_paid': {
        icon: 'noto:honey-pot',
        fact: 'דבש טבעי → אנטיבקטריאלי',
        benefit: 'Natural Sweetness'
    },
    'jala_paid': {
        icon: 'openmoji:peanut',
        fact: 'אגוזים → עשיר בשומנים בריאים',
        benefit: 'Healthy Fats'
    },
    'extra_bread_paid': {
        icon: 'noto:bread',
        fact: 'לחם טרי → פחמימות מורכבות',
        benefit: 'Sustained Energy'
    },
    'croutons_paid': {
        icon: 'noto:bread',
        fact: 'קרוטונים קריספיים → טעם וקריספ',
        benefit: 'Crispy Texture'
    },
    'tofu_oil_salt_paid': {
        icon: 'fluent-emoji-flat:tofu',
        fact: 'טופו מוקפץ → חלבון צמחי',
        benefit: 'Plant Protein'
    }
}

export function getIngredientFact(ingredientId: string): IngredientFact | null {
    return ingredientFacts[ingredientId] || null
}
