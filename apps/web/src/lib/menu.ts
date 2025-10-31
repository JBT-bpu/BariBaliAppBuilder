export interface NutritionData {
    grams_per_scoop: number;
    per_100g: {
        kcal: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
}

export interface NutritionFact {
    he: string;
    en: string;
}

export interface MenuItem {
    id: string;
    he: string;
    en: string;
    price_delta?: number;
    unit_price?: number;
    iconify_id: string;
    nutrition?: NutritionData;
    facts?: NutritionFact[];
}

export interface MenuCategory {
    key: string;
    title_he: string;
    title_en: string;
    selection: {
        type: 'range_by_size' | 'range' | 'exact' | 'up_to';
        min?: number;
        max?: number;
        count?: number;
        included_free?: number;
        extra_price_applies?: boolean;
        size_rules?: Record<string, [number, number]>;
    };
    items: MenuItem[];
}

export interface MenuSize {
    id: string;
    label_he: string;
    label_en: string;
    base_price: number;
    veg_min: number;
    veg_max: number;
}

export interface MenuData {
    meta: {
        brand: string;
        locale: string;
        currency: string;
        notes: string;
    };
    sizes: MenuSize[];
    rules: {
        sauces_included_free: number;
        sauces_min: number;
        sauces_max: number;
        primary_extra_max: number;
        paid_additions_max: number;
        bread_choice_required: boolean;
        mixing_choice_required: boolean;
    };
    categories: MenuCategory[];
}

export const menuData: MenuData = {
    "meta": {
        "brand": "בריבלי",
        "locale": "he-IL",
        "currency": "ILS",
        "notes": "MVP menu structure with Iconify icon mappings"
    },
    "sizes": [
        {
            "id": "750",
            "label_he": "750 מ״ל",
            "label_en": "750 ml",
            "base_price": 54.0,
            "veg_min": 4,
            "veg_max": 12
        },
        {
            "id": "1000",
            "label_he": "1000 מ״ל",
            "label_en": "1000 ml",
            "base_price": 62.0,
            "veg_min": 4,
            "veg_max": 14
        },
        {
            "id": "1500",
            "label_he": "1500 מ״ל",
            "label_en": "1500 ml",
            "base_price": 72.0,
            "veg_min": 4,
            "veg_max": 16
        }
    ],
    "rules": {
        "sauces_included_free": 3,
        "sauces_min": 1,
        "sauces_max": 10,
        "primary_extra_max": 1,
        "paid_additions_max": 5,
        "bread_choice_required": true,
        "mixing_choice_required": true
    },
    "categories": [
        {
            "key": "veggies",
            "title_he": "ירקות לבחירה",
            "title_en": "Vegetables to choose",
            "selection": {
                "type": "range_by_size",
                "size_rules": {
                    "750": [4, 12],
                    "1000": [4, 14],
                    "1500": [4, 16]
                }
            },
            "items": [
                {
                    "id": "lettuce",
                    "he": "חסה",
                    "en": "Lettuce",
                    "price_delta": 0,
                    "iconify_id": "noto:leafy-green",
                    "nutrition": {
                        "grams_per_scoop": 25,
                        "per_100g": {
                            "kcal": 15,
                            "protein": 1.4,
                            "carbs": 2.9,
                            "fat": 0.2,
                            "fiber": 1.3
                        }
                    },
                    "facts": [
                        { "he": "ירק עלים עשיר בסיבים", "en": "Leafy green rich in fiber." },
                        { "he": "כמעט ללא קלוריות", "en": "Almost calorie-free." }
                    ]
                },
                {
                    "id": "baby_leaf",
                    "he": "עלה בייבי",
                    "en": "Baby leaves",
                    "price_delta": 0,
                    "iconify_id": "noto:leafy-green"
                },
                {
                    "id": "tomato",
                    "he": "עגבניות",
                    "en": "Tomato",
                    "price_delta": 0,
                    "iconify_id": "noto:tomato",
                    "nutrition": {
                        "grams_per_scoop": 30,
                        "per_100g": {
                            "kcal": 18,
                            "protein": 0.9,
                            "carbs": 3.9,
                            "fat": 0.2,
                            "fiber": 1.2
                        }
                    },
                    "facts": [
                        { "he": "ליקופן נוגד חמצון", "en": "Rich in lycopene antioxidant." },
                        { "he": "ויטמין C טבעי", "en": "Natural vitamin C source." }
                    ]
                },
                {
                    "id": "cucumber",
                    "he": "מלפפון",
                    "en": "Cucumber",
                    "price_delta": 0,
                    "iconify_id": "twemoji:cucumber"
                },
                {
                    "id": "bell_pepper",
                    "he": "גמבה",
                    "en": "Bell pepper",
                    "price_delta": 0,
                    "iconify_id": "noto:bell-pepper"
                },
                {
                    "id": "black_lentils",
                    "he": "עדשים שחורות",
                    "en": "Black lentils",
                    "price_delta": 0,
                    "iconify_id": "openmoji:lentils"
                },
                {
                    "id": "green_lentils",
                    "he": "עדשים ירוקות",
                    "en": "Green lentils",
                    "price_delta": 0,
                    "iconify_id": "openmoji:lentils"
                },
                {
                    "id": "mung_beans",
                    "he": "שעועית מאש",
                    "en": "Mung beans",
                    "price_delta": 0,
                    "iconify_id": "noto:peanuts"
                },
                {
                    "id": "carrot",
                    "he": "גזר",
                    "en": "Carrot",
                    "price_delta": 0,
                    "iconify_id": "noto:carrot"
                },
                {
                    "id": "quinoa",
                    "he": "קינואה",
                    "en": "Quinoa",
                    "price_delta": 2.0,
                    "iconify_id": "openmoji:quinoa",
                    "nutrition": {
                        "grams_per_scoop": 50,
                        "per_100g": {
                            "kcal": 120,
                            "protein": 4.4,
                            "carbs": 21.3,
                            "fat": 1.9,
                            "fiber": 2.8
                        }
                    },
                    "facts": [
                        { "he": "חלבון מלא צמחי", "en": "Complete plant protein." },
                        { "he": "עשירה בסיבים", "en": "High in fiber." }
                    ]
                },
                {
                    "id": "brown_rice",
                    "he": "אורז מלא",
                    "en": "Brown rice",
                    "price_delta": 0,
                    "iconify_id": "openmoji:brown-rice"
                },
                {
                    "id": "bulgur",
                    "he": "בורגול",
                    "en": "Bulgur",
                    "price_delta": 0,
                    "iconify_id": "openmoji:bulgur"
                },
                {
                    "id": "roasted_eggplant",
                    "he": "חציל קלוי",
                    "en": "Roasted eggplant",
                    "price_delta": 0,
                    "iconify_id": "noto:eggplant"
                },
                {
                    "id": "chickpeas",
                    "he": "גרגירי חומוס",
                    "en": "Chickpeas",
                    "price_delta": 0,
                    "iconify_id": "openmoji:chickpeas"
                },
                {
                    "id": "baked_sweet_potato",
                    "he": "בטטה אפויה",
                    "en": "Baked sweet potato",
                    "price_delta": 0,
                    "iconify_id": "openmoji:sweet-potato"
                },
                {
                    "id": "baked_potato",
                    "he": "תפו\"א אפוי",
                    "en": "Baked potato",
                    "price_delta": 0,
                    "iconify_id": "noto:potato"
                },
                {
                    "id": "sprouts",
                    "he": "נבטים",
                    "en": "Sprouts",
                    "price_delta": 0,
                    "iconify_id": "openmoji:seedling"
                },
                {
                    "id": "green_peas",
                    "he": "אפונה ירוקה",
                    "en": "Green peas",
                    "price_delta": 0,
                    "iconify_id": "noto:peanuts"
                },
                {
                    "id": "corn",
                    "he": "תירס",
                    "en": "Corn",
                    "price_delta": 0,
                    "iconify_id": "noto:ear-of-corn"
                },
                {
                    "id": "cabbage_white",
                    "he": "כרוב לבן",
                    "en": "White cabbage",
                    "price_delta": 0,
                    "iconify_id": "openmoji:cabbage"
                },
                {
                    "id": "cabbage_purple",
                    "he": "כרוב סגול",
                    "en": "Purple cabbage",
                    "price_delta": 0,
                    "iconify_id": "openmoji:cabbage"
                },
                {
                    "id": "mushrooms",
                    "he": "פטריות",
                    "en": "Mushrooms",
                    "price_delta": 0,
                    "iconify_id": "noto:mushroom"
                },
                {
                    "id": "red_onion",
                    "he": "בצל סגול",
                    "en": "Red onion",
                    "price_delta": 0,
                    "iconify_id": "noto:onion"
                },
                {
                    "id": "green_onion",
                    "he": "בצל ירוק",
                    "en": "Green onion",
                    "price_delta": 0,
                    "iconify_id": "noto:onion"
                },
                {
                    "id": "radish",
                    "he": "צנון",
                    "en": "Radish",
                    "price_delta": 0,
                    "iconify_id": "twemoji:radish"
                },
                {
                    "id": "kohlrabi",
                    "he": "קולורבי",
                    "en": "Kohlrabi",
                    "price_delta": 0,
                    "iconify_id": "openmoji:cabbage"
                },
                {
                    "id": "celery",
                    "he": "סלרי",
                    "en": "Celery",
                    "price_delta": 0,
                    "iconify_id": "noto:leafy-green"
                },
                {
                    "id": "fusilli_pasta",
                    "he": "פסטה מסולסלת",
                    "en": "Fusilli pasta",
                    "price_delta": 0,
                    "iconify_id": "noto:spaghetti"
                },
                {
                    "id": "cilantro",
                    "he": "כוסברה",
                    "en": "Coriander",
                    "price_delta": 0,
                    "iconify_id": "noto:herb"
                },
                {
                    "id": "parsley",
                    "he": "פטרוזיליה",
                    "en": "Parsley",
                    "price_delta": 0,
                    "iconify_id": "noto:herb"
                },
                {
                    "id": "pickles",
                    "he": "מלפפון חמוץ",
                    "en": "Pickles",
                    "price_delta": 0,
                    "iconify_id": "twemoji:cucumber"
                },
                {
                    "id": "hot_pepper",
                    "he": "פלפל חריף",
                    "en": "Hot pepper",
                    "price_delta": 0,
                    "iconify_id": "noto:hot-pepper"
                },
                {
                    "id": "cranberries",
                    "he": "חמוציות",
                    "en": "Cranberries (dried)",
                    "price_delta": 0,
                    "iconify_id": "openmoji:cranberries"
                },
                {
                    "id": "black_olives",
                    "he": "זיתים שחורים",
                    "en": "Black olives",
                    "price_delta": 0,
                    "iconify_id": "noto:olive"
                },
                {
                    "id": "green_olives",
                    "he": "זיתים ירוקים",
                    "en": "Green olives",
                    "price_delta": 0,
                    "iconify_id": "noto:olive"
                },
                {
                    "id": "sunflower_seeds",
                    "he": "גרעיני חמניה",
                    "en": "Sunflower seeds",
                    "price_delta": 0,
                    "iconify_id": "openmoji:sunflower-seeds"
                },
                {
                    "id": "sesame",
                    "he": "שומשום",
                    "en": "Sesame",
                    "price_delta": 0,
                    "iconify_id": "openmoji:sesame"
                },
                {
                    "id": "chia",
                    "he": "זרעי צ'יה",
                    "en": "Chia seeds",
                    "price_delta": 0,
                    "iconify_id": "openmoji:seedling"
                },
                {
                    "id": "zaatar",
                    "he": "זעתר",
                    "en": "Za'atar",
                    "price_delta": 0,
                    "iconify_id": "openmoji:seedling"
                },
                {
                    "id": "fresh_beet",
                    "he": "סלק טרי",
                    "en": "Fresh beet",
                    "price_delta": 0,
                    "iconify_id": "openmoji:beet"
                }
            ]
        },
        {
            "key": "sauces",
            "title_he": "רטבים לבחירה",
            "title_en": "Sauces",
            "selection": {
                "type": "range",
                "min": 1,
                "max": 10,
                "included_free": 3,
                "extra_price_applies": true
            },
            "items": [
                {
                    "id": "olive_oil",
                    "he": "שמן זית",
                    "en": "Olive oil",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:olive-oil",
                    "nutrition": {
                        "grams_per_scoop": 10,
                        "per_100g": {
                            "kcal": 884,
                            "protein": 0,
                            "carbs": 0,
                            "fat": 100,
                            "fiber": 0
                        }
                    },
                    "facts": [
                        { "he": "שומן חד-בלעדי בריא", "en": "Healthy monounsaturated fat." },
                        { "he": "אנטי דלקתי טבעי", "en": "Natural anti-inflammatory." }
                    ]
                },
                {
                    "id": "lemon_juice",
                    "he": "לימון טרי",
                    "en": "Fresh lemon",
                    "unit_price": 3.0,
                    "iconify_id": "noto:lemon"
                },
                {
                    "id": "thousand_island",
                    "he": "אלף האיים",
                    "en": "Thousand Island",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:mayonnaise"
                },
                {
                    "id": "garlic",
                    "he": "רוטב שום",
                    "en": "Garlic sauce",
                    "unit_price": 3.0,
                    "iconify_id": "noto:garlic"
                },
                {
                    "id": "citrus_vinaigrette",
                    "he": "ויניגרט הדרים",
                    "en": "Citrus vinaigrette",
                    "unit_price": 3.0,
                    "iconify_id": "noto:lemon"
                },
                {
                    "id": "tahini",
                    "he": "טחינה",
                    "en": "Tahini",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:tahini"
                },
                {
                    "id": "pesto",
                    "he": "פסטו",
                    "en": "Pesto",
                    "unit_price": 4.0,
                    "iconify_id": "openmoji:pesto"
                },
                {
                    "id": "zhug",
                    "he": "סחוג",
                    "en": "Zhoug",
                    "unit_price": 4.0,
                    "iconify_id": "twemoji:hot-pepper"
                },
                {
                    "id": "balsamic",
                    "he": "בלסמי",
                    "en": "Balsamic",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:balsamic-vinegar"
                },
                {
                    "id": "sweet_chili",
                    "he": "צ'ילי מתוק",
                    "en": "Sweet chili",
                    "unit_price": 3.0,
                    "iconify_id": "twemoji:hot-pepper"
                },
                {
                    "id": "teriyaki",
                    "he": "טריאקי",
                    "en": "Teriyaki",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:soy-sauce"
                },
                {
                    "id": "soy",
                    "he": "סויה סיני",
                    "en": "Soy (Chinese)",
                    "unit_price": 3.0,
                    "iconify_id": "openmoji:soy-sauce"
                },
                {
                    "id": "caesar",
                    "he": "קיסר",
                    "en": "Caesar",
                    "unit_price": 5.0,
                    "iconify_id": "openmoji:caesar-dressing"
                }
            ]
        },
        {
            "key": "mixing",
            "title_he": "בחירת ערבוב",
            "title_en": "Mixing preference",
            "selection": {
                "type": "exact",
                "count": 1
            },
            "items": [
                {
                    "id": "mix_no_sauce",
                    "he": "לערבב את הסלט ללא הרוטב",
                    "en": "Mix salad without dressing",
                    "price_delta": 0,
                    "iconify_id": "noto:spaghetti"
                },
                {
                    "id": "no_mix_thanks",
                    "he": "לא לערבב, תודה",
                    "en": "Do not mix",
                    "price_delta": 0,
                    "iconify_id": "noto:spaghetti"
                }
            ]
        },
        {
            "key": "side",
            "title_he": "לחם או קרוטונים לצד הסלט",
            "title_en": "Bread or croutons on the side",
            "selection": {
                "type": "exact",
                "count": 1
            },
            "items": [
                {
                    "id": "bread",
                    "he": "עם לחם 🍞",
                    "en": "With bread",
                    "price_delta": 0,
                    "iconify_id": "noto:bread"
                },
                {
                    "id": "croutons",
                    "he": "עם קרוטונים",
                    "en": "With croutons",
                    "price_delta": 0,
                    "iconify_id": "noto:bread"
                },
                {
                    "id": "none",
                    "he": "ללא תוספת",
                    "en": "No side",
                    "price_delta": 0,
                    "iconify_id": "noto:bread"
                }
            ]
        },
        {
            "key": "primary_extra",
            "title_he": "בחרו תוספת (כלולה)",
            "title_en": "Choose one extra (included)",
            "selection": {
                "type": "up_to",
                "max": 1
            },
            "items": [
                {
                    "id": "egg",
                    "he": "ביצה קשה",
                    "en": "Hard-boiled egg",
                    "price_delta": 0,
                    "iconify_id": "noto:egg",
                    "nutrition": {
                        "grams_per_scoop": 40,
                        "per_100g": {
                            "kcal": 155,
                            "protein": 13,
                            "carbs": 1.1,
                            "fat": 11,
                            "fiber": 0
                        }
                    },
                    "facts": [
                        { "he": "חלבון מלא ואיכותי", "en": "Complete, high-quality protein." },
                        { "he": "מכיל כל חומצות האמינו", "en": "Contains all essential amino acids." }
                    ]
                },
                {
                    "id": "tuna",
                    "he": "טונה",
                    "en": "Tuna",
                    "price_delta": 0,
                    "iconify_id": "noto:fish",
                    "nutrition": {
                        "grams_per_scoop": 40,
                        "per_100g": {
                            "kcal": 132,
                            "protein": 29,
                            "carbs": 0,
                            "fat": 1,
                            "fiber": 0
                        }
                    },
                    "facts": [
                        { "he": "חלבון רזה במיוחד", "en": "Extremely lean protein." },
                        { "he": "אומגה-3 בריא ללב", "en": "Omega-3 for heart health." }
                    ]
                },
                {
                    "id": "tofu_olive_oil",
                    "he": "טופו מוקפץ בשמן זית",
                    "en": "Stir-fried tofu in olive oil",
                    "price_delta": 0,
                    "iconify_id": "fluent-emoji-flat:tofu"
                },
                {
                    "id": "feta5",
                    "he": "גבינת פטה 5%",
                    "en": "Feta cheese 5%",
                    "price_delta": 0,
                    "iconify_id": "noto:cheese-wedge"
                },
                {
                    "id": "baby_mozzarella",
                    "he": "בייבי מוצרלה",
                    "en": "Baby mozzarella",
                    "price_delta": 0,
                    "iconify_id": "noto:cheese-wedge"
                }
            ]
        },
        {
            "key": "paid_additions",
            "title_he": "תוספות בתשלום",
            "title_en": "Paid additions",
            "selection": {
                "type": "up_to",
                "max": 5
            },
            "items": [
                {
                    "id": "egg_paid",
                    "he": "ביצה קשה",
                    "en": "Hard-boiled egg",
                    "unit_price": 5.0,
                    "iconify_id": "noto:egg",
                    "nutrition": {
                        "grams_per_scoop": 40,
                        "per_100g": {
                            "kcal": 155,
                            "protein": 13,
                            "carbs": 1.1,
                            "fat": 11,
                            "fiber": 0
                        }
                    }
                },
                {
                    "id": "feta_paid",
                    "he": "פטה",
                    "en": "Feta",
                    "unit_price": 7.0,
                    "iconify_id": "noto:cheese-wedge",
                    "nutrition": {
                        "grams_per_scoop": 30,
                        "per_100g": {
                            "kcal": 264,
                            "protein": 14.2,
                            "carbs": 4.1,
                            "fat": 21.3,
                            "fiber": 0
                        }
                    }
                },
                {
                    "id": "tuna_paid",
                    "he": "טונה",
                    "en": "Tuna",
                    "unit_price": 7.0,
                    "iconify_id": "noto:fish",
                    "nutrition": {
                        "grams_per_scoop": 40,
                        "per_100g": {
                            "kcal": 132,
                            "protein": 29,
                            "carbs": 0,
                            "fat": 1,
                            "fiber": 0
                        }
                    }
                },
                {
                    "id": "tofu_teriyaki_paid",
                    "he": "טופו מוקפץ בטריאקי",
                    "en": "Stir-fried tofu in teriyaki",
                    "unit_price": 10.0,
                    "iconify_id": "fluent-emoji-flat:tofu",
                    "nutrition": {
                        "grams_per_scoop": 50,
                        "per_100g": {
                            "kcal": 76,
                            "protein": 8.1,
                            "carbs": 1.9,
                            "fat": 4.2,
                            "fiber": 0.4
                        }
                    }
                },
                {
                    "id": "halloumi_paid",
                    "he": "גבינת חלומי",
                    "en": "Halloumi",
                    "unit_price": 12.0,
                    "iconify_id": "noto:cheese-wedge",
                    "nutrition": {
                        "grams_per_scoop": 35,
                        "per_100g": {
                            "kcal": 290,
                            "protein": 25.2,
                            "carbs": 0.7,
                            "fat": 23.3,
                            "fiber": 0
                        }
                    }
                },
                {
                    "id": "parmesan_paid",
                    "he": "פרמז'ן",
                    "en": "Parmesan",
                    "unit_price": 4.0,
                    "iconify_id": "noto:cheese-wedge",
                    "nutrition": {
                        "grams_per_scoop": 10,
                        "per_100g": {
                            "kcal": 431,
                            "protein": 38,
                            "carbs": 1.3,
                            "fat": 29,
                            "fiber": 0
                        }
                    }
                },
                {
                    "id": "honey_paid",
                    "he": "דבש",
                    "en": "Honey",
                    "unit_price": 4.0,
                    "iconify_id": "noto:honey-pot",
                    "nutrition": {
                        "grams_per_scoop": 20,
                        "per_100g": {
                            "kcal": 304,
                            "protein": 0.3,
                            "carbs": 82.4,
                            "fat": 0,
                            "fiber": 0.2
                        }
                    }
                },
                {
                    "id": "jala_paid",
                    "he": "ג'עלה",
                    "en": "Jala (nuts?)",
                    "unit_price": 4.0,
                    "iconify_id": "openmoji:peanut",
                    "nutrition": {
                        "grams_per_scoop": 25,
                        "per_100g": {
                            "kcal": 567,
                            "protein": 25.8,
                            "carbs": 20,
                            "fat": 49.2,
                            "fiber": 6
                        }
                    }
                },
                {
                    "id": "extra_bread_paid",
                    "he": "תוספת לחם",
                    "en": "Extra bread",
                    "unit_price": 4.0,
                    "iconify_id": "noto:bread",
                    "nutrition": {
                        "grams_per_scoop": 50,
                        "per_100g": {
                            "kcal": 265,
                            "protein": 9,
                            "carbs": 49,
                            "fat": 3.3,
                            "fiber": 2.7
                        }
                    }
                },
                {
                    "id": "croutons_paid",
                    "he": "קרוטונים",
                    "en": "Croutons",
                    "unit_price": 3.0,
                    "iconify_id": "noto:bread",
                    "nutrition": {
                        "grams_per_scoop": 30,
                        "per_100g": {
                            "kcal": 386,
                            "protein": 9.3,
                            "carbs": 72,
                            "fat": 5.2,
                            "fiber": 4.2
                        }
                    }
                },
                {
                    "id": "tofu_oil_salt_paid",
                    "he": "טופו מוקפץ בשמן זית מלח פלפל",
                    "en": "Tofu fried in olive oil, salt & pepper",
                    "unit_price": 10.0,
                    "iconify_id": "fluent-emoji-flat:tofu",
                    "nutrition": {
                        "grams_per_scoop": 50,
                        "per_100g": {
                            "kcal": 150,
                            "protein": 8.1,
                            "carbs": 1.9,
                            "fat": 11.2,
                            "fiber": 0.4
                        }
                    }
                }
            ]
        }
    ]
};
