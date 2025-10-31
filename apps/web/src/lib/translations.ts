export const translations = {
    he: {
        // Header
        'app_title': 'בנאי סלט אינטראקטיבי',
        'back': 'חזרה',

        // Size selector
        'choose_size': 'בחר גודל סלט',
        'small': 'קטן',
        'medium': 'בינוני',
        'large': 'גדול',
        'small_desc': 'סלט בסיסי',
        'medium_desc': 'סלט מושלם',
        'large_desc': 'סלט מפואר',
        'ingredients': 'מרכיבים',

        // Ingredients
        'base_ingredients': 'מרכיבי בסיס',
        'random': 'אקראי',

        // Add-ons
        'toppings': 'תוספות',
        'sauces': 'רטבים',
        'up_to': 'עד',

        // Bread
        'bread_or_croutons': 'לחם או קרוטונים לצד הסלט',
        'with_bread': 'עם לחם 🍞',
        'with_croutons': 'עם קרוטונים',
        'no_side': 'ללא תוספת',

        // Actions
        'mix_and_order': 'ערבב והזמן',
        'mixing': 'מערבב...',
        'mixing_title': 'מערבב את הסלט שלך!',
        'mixing_subtitle': 'מכין הכל להזמנה...',

        // Bowl stats
        'ingredients_count': 'מרכיבים',
        'bowl_full': 'מלא',

        // Loading
        'loading_bowl': 'טוען קערה...',
    },
    en: {
        // Header
        'app_title': 'Interactive Salad Builder',
        'back': 'Back',

        // Size selector
        'choose_size': 'Choose Salad Size',
        'small': 'Small',
        'medium': 'Medium',
        'large': 'Large',
        'small_desc': 'Basic Salad',
        'medium_desc': 'Perfect Salad',
        'large_desc': 'Premium Salad',
        'ingredients': 'ingredients',

        // Ingredients
        'base_ingredients': 'Base Ingredients',
        'random': 'Random',

        // Add-ons
        'toppings': 'Toppings',
        'sauces': 'Sauces',
        'up_to': 'up to',

        // Bread
        'bread_or_croutons': 'Bread or croutons on the side',
        'with_bread': 'With bread 🍞',
        'with_croutons': 'With croutons',
        'no_side': 'No side',
        'choose_bread_addition': 'Choose bread addition',
        'bread': 'Bread',
        'croutons': 'Toasted bread cubes',
        'optional_leave_empty': 'Optional - can be left empty',

        // Actions
        'mix_and_order': 'Mix & Order',
        'mixing': 'Mixing...',
        'mixing_title': 'Mixing your salad!',
        'mixing_subtitle': 'Preparing everything for your order...',

        // Bowl stats
        'ingredients_count': 'ingredients',
        'bowl_full': 'full',

        // Loading
        'loading_bowl': 'Loading bowl...',
    }
}

export type TranslationKey = keyof typeof translations.he

export const useTranslation = () => {
    // This will be used in components that need translations
    // We'll import the store hook in the component
}
