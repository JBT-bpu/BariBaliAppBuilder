'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData, type MenuItem } from '@/lib/menu';
import { calculateMacrosForScoop } from '@/lib/nutrition';
import { cn } from '@/lib/utils';

interface SelectedItemsStatsProps {
    selectedIds: string[];
    category: string;
    language: 'he' | 'en';
}

export const SelectedItemsStats = React.memo(function SelectedItemsStats({
    selectedIds,
    category,
    language,
}: SelectedItemsStatsProps) {
    if (selectedIds.length === 0) return null;

    // Get items from menu
    const categoryData = menuData.categories.find(c => c.key === category);
    const items = categoryData?.items || [];

    // Calculate totals
    let totalKcal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const selectedItems = selectedIds
        .map(id => items.find(item => item.id === id))
        .filter(Boolean) as MenuItem[];

    selectedItems.forEach(item => {
        const macros = calculateMacrosForScoop(item);
        totalKcal += macros.kcal;
        totalProtein += macros.protein;
        totalCarbs += macros.carbs;
        totalFat += macros.fat;
    });

    return (
        <AnimatePresence>
            {selectedIds.length > 0 && (
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="text-xs font-semibold text-ink mb-2">
                        {language === 'he' ? 'סה״כ נבחר' : 'Selected Total'}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                            <div className="text-sm font-bold text-green">{Math.round(totalKcal)}</div>
                            <div className="text-[10px] text-gray-600">kcal</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-blue-500">{totalProtein.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-600">P</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-orange-500">{totalCarbs.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-600">C</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-purple-500">{totalFat.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-600">F</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
