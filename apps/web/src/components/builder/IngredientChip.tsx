'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { categoryGradients, colors, animations, shadows } from '@/ui/tokens';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

interface IngredientChipProps {
    ingredient: {
        id: string;
        he: string;
        en: string;
        icon?: string;
        price_delta?: number;
        unit_price?: number;
        category: string;
        rarity?: string;
    };
    isSelected: boolean;
    isDisabled: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}

// Icon mapping for ingredients - premium Iconify icons
const getIngredientIcon = (ingredientId: string, category: string) => {
    const iconMap: Record<string, string> = {
        // Vegetables
        lettuce: 'noto:leafy-green',
        baby_leaf: 'noto:leafy-green',
        tomato: 'noto:tomato',
        cucumber: 'noto:cucumber',
        bell_pepper: 'noto:bell-pepper',
        carrot: 'noto:carrot',
        cabbage_white: 'noto:cabbage',
        cabbage_purple: 'noto:cabbage',
        mushrooms: 'noto:mushroom',
        red_onion: 'noto:onion',
        green_onion: 'noto:onion',
        radish: 'noto:carrot',
        celery: 'noto:leafy-green',
        cilantro: 'noto:leafy-green',
        parsley: 'noto:leafy-green',
        sprouts: 'noto:seedling',
        green_peas: 'noto:peas',
        corn: 'noto:corn',
        black_olives: 'noto:olive',
        green_olives: 'noto:olive',
        hot_pepper: 'noto:hot-pepper',
        cranberries: 'noto:cherries',
        sunflower_seeds: 'noto:seedling',
        sesame: 'noto:seedling',
        chia: 'noto:seedling',
        zaatar: 'noto:leafy-green',
        fresh_beet: 'noto:carrot',
        quinoa: 'noto:corn',
        brown_rice: 'noto:cooked-rice',
        bulgur: 'noto:cooked-rice',
        roasted_eggplant: 'noto:aubergine',
        chickpeas: 'noto:peas',
        baked_sweet_potato: 'noto:potato',
        baked_potato: 'noto:potato',
        fusilli_pasta: 'noto:spaghetti',
        kohlrabi: 'noto:carrot',
        black_lentils: 'noto:peas',
        green_lentils: 'noto:peas',
        mung_beans: 'noto:peas',

        // Proteins
        egg: 'noto:egg',
        tuna: 'noto:fish',
        tofu_olive_oil: 'noto:tofu',
        feta5: 'noto:cheese-wedge',
        baby_mozzarella: 'noto:cheese-wedge',
        egg_paid: 'noto:egg',
        feta_paid: 'noto:cheese-wedge',
        tuna_paid: 'noto:fish',
        halloumi_paid: 'noto:cheese-wedge',
        parmesan_paid: 'noto:cheese-wedge',
        tofu_teriyaki_paid: 'noto:tofu',
        tofu_oil_salt_paid: 'noto:tofu',

        // Sauces
        olive_oil: 'noto:olive',
        lemon_juice: 'noto:lemon',
        thousand_island: 'noto:bottle-with-popping-cork',
        garlic: 'noto:garlic',
        citrus_vinaigrette: 'noto:lemon',
        tahini: 'noto:bottle-with-popping-cork',
        pesto: 'noto:leafy-green',
        zhug: 'noto:hot-pepper',
        balsamic: 'noto:bottle-with-popping-cork',
        sweet_chili: 'noto:hot-pepper',
        teriyaki: 'noto:bottle-with-popping-cork',
        soy: 'noto:bottle-with-popping-cork',
        caesar: 'noto:leafy-green',

        // Bread/Sides
        bread: 'noto:bread',
        croutons: 'noto:bread',
        none: 'noto:cross-mark',
        extra_bread_paid: 'noto:bread',
        croutons_paid: 'noto:bread',

        // Mixing
        mix_no_sauce: 'noto:shaker',
        no_mix_thanks: 'noto:cross-mark',

        // Paid additions
        honey_paid: 'noto:honey-pot',
        jala_paid: 'noto:chestnut',
    };

    return iconMap[ingredientId] || 'noto:question-mark';
};

export const IngredientChip = React.memo(function IngredientChip({
    ingredient,
    isSelected,
    isDisabled,
    onClick,
    className,
}: IngredientChipProps) {
    // Check if this is a premium item (has price_delta or unit_price)
    const isPremium = (ingredient.price_delta && ingredient.price_delta > 0) ||
        (ingredient.unit_price && ingredient.unit_price > 0);

    // Get price display
    const getPriceDisplay = () => {
        if (ingredient.price_delta && ingredient.price_delta > 0) {
            return `+₪${ingredient.price_delta}`;
        }
        if (ingredient.unit_price && ingredient.unit_price > 0) {
            return `+₪${ingredient.unit_price}`;
        }
        return null;
    };

    const priceDisplay = getPriceDisplay();
    const iconName = getIngredientIcon(ingredient.id, ingredient.category);

    // Get premium gradient based on category
    const getPremiumGradient = () => {
        const gradients = {
            veggies: categoryGradients.veggiePremium,
            proteins: categoryGradients.proteinPremium,
            sauces: categoryGradients.saucePremium,
            primary_extra: categoryGradients.proteinPremium,
            paid_additions: categoryGradients.addonPremium,
            side: categoryGradients.breadPremium,
            mixing: categoryGradients.veggiePremium,
        };
        return gradients[ingredient.category as keyof typeof gradients] || categoryGradients.veggiePremium;
    };

    // Enhanced click handler with haptics
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled) {
            haptics.tap();
            onClick(e);
        }
    };

    return (
        <motion.button
            className={cn(
                'relative w-full h-11 rounded-xl font-semibold text-sm',
                'flex items-center justify-between px-3 py-2',
                'focus:outline-none focus:ring-2 focus:ring-green/50 focus:ring-offset-1',
                'disabled:cursor-not-allowed disabled:opacity-40',
                'transition-all duration-200 ease-out',
                'hover:shadow-lg active:scale-[0.98]',
                isSelected ? 'text-white' : 'text-gray-900',
                className
            )}
            style={{
                background: isSelected
                    ? getPremiumGradient()
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: isSelected ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: isSelected ? 'blur(12px)' : 'none',
                border: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #e5e7eb',
                boxShadow: isSelected
                    ? (isPremium
                        ? '0 0 0 2px rgba(245, 158, 11, 0.4), 0 8px 24px rgba(90, 197, 104, 0.25), 0 4px 12px rgba(10, 61, 46, 0.1)'
                        : '0 8px 24px rgba(90, 197, 104, 0.25), 0 4px 12px rgba(10, 61, 46, 0.1), 0 2px 6px rgba(10, 61, 46, 0.08)')
                    : '0 1px 3px rgba(10, 61, 46, 0.06), 0 1px 2px rgba(10, 61, 46, 0.04)',
            }}
            onClick={handleClick}
            disabled={isDisabled}
            whileHover={{
                scale: isDisabled ? 1 : 1.02,
                transition: { duration: 0.15 }
            }}
            whileTap={{
                scale: isDisabled ? 1 : 0.98,
                transition: { duration: 0.1 }
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Left side: Icon + Label */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Premium Iconify Icon */}
                <motion.div
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                    whileHover={{ rotate: isSelected ? 0 : 5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon
                        icon={iconName}
                        className={cn(
                            'w-5 h-5 transition-colors duration-200',
                            isSelected ? 'text-white drop-shadow-sm' : 'text-gray-600'
                        )}
                    />
                </motion.div>

                {/* Label */}
                <span className="truncate text-xs sm:text-sm font-medium leading-tight">
                    {ingredient.he}
                </span>
            </div>

            {/* Right side: Price + Checkmark */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Price delta */}
                {priceDisplay && (
                    <motion.span
                        className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded-full text-center min-w-[32px]',
                            'transition-all duration-200',
                            isSelected
                                ? 'bg-white/25 text-white border border-white/30'
                                : 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                        )}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {priceDisplay}
                    </motion.span>
                )}

                {/* Premium checkmark when selected */}
                {isSelected && (
                    <motion.div
                        className="w-5 h-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center flex-shrink-0"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            delay: 0.1
                        }}
                    >
                        <Icon
                            icon="lucide:check"
                            className="w-3 h-3 text-white drop-shadow-sm"
                        />
                    </motion.div>
                )}
            </div>

            {/* Premium glow effect for selected items */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 rounded-xl opacity-50"
                    style={{
                        background: `linear-gradient(135deg, ${isPremium ? 'rgba(245, 158, 11, 0.1)' : 'rgba(90, 197, 104, 0.1)'}, transparent)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.button>
    );
});
