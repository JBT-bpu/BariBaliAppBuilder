import { useState, useRef } from 'react'
import { MenuItem } from './menu'
import { getRandomNutritionFact } from './nutrition'
import { haptics } from './haptics'

export interface PopData {
    text: string
    anchor: DOMRect
    macroChip?: string
    badge?: string
}

export function useNutritionPop() {
    const [pop, setPop] = useState<PopData | null>(null)
    const timer = useRef<NodeJS.Timeout | null>(null)
    const lastShownAt = useRef(0)

    const POPUP_CONFIG = {
        ttlMs: 2000,
        throttleMs: 1500,
        haptics: true,
        showMacroChip: true
    }

    function show(item: MenuItem, anchorEl: HTMLElement, language: 'he' | 'en' = 'he') {
        const now = Date.now()

        // Throttle: at most 1 pop every 1.5s
        if (now - lastShownAt.current < POPUP_CONFIG.throttleMs) {
            // Replace queued: just update text & reset timer
            if (timer.current) {
                clearTimeout(timer.current)
            }
        }

        lastShownAt.current = now
        const rect = anchorEl.getBoundingClientRect()

        // Get nutrition fact
        const fact = getRandomNutritionFact(item, language)
        if (!fact) return

        // Determine macro chip (if significant contribution)
        let macroChip: string | undefined
        if (POPUP_CONFIG.showMacroChip && item.nutrition) {
            const macros = item.nutrition.per_100g
            const grams = item.nutrition.grams_per_scoop

            // Calculate per-scoop macros
            const protein = Math.round((macros.protein * grams) / 100 * 10) / 10
            const carbs = Math.round((macros.carbs * grams) / 100 * 10) / 10
            const fat = Math.round((macros.fat * grams) / 100 * 10) / 10

            // Show macro chip for significant contributions
            if (protein >= 5) macroChip = `+${protein}g P`
            else if (carbs >= 10) macroChip = `+${carbs}g C`
            else if (fat >= 5) macroChip = `+${fat}g F`
        }

        // Check for badge near thresholds
        let badge: string | undefined
        if (item.nutrition) {
            const macros = item.nutrition.per_100g
            const grams = item.nutrition.grams_per_scoop
            const protein = (macros.protein * grams) / 100

            if (protein >= 10) {
                badge = language === 'he' ? 'חלבון גבוה ✓' : 'High Protein ✓'
            }
        }

        setPop({
            text: fact,
            anchor: rect,
            macroChip,
            badge
        })

        // Auto-hide after 2 seconds
        timer.current = setTimeout(() => {
            setPop(null)
        }, POPUP_CONFIG.ttlMs)

        // Haptic feedback
        if (POPUP_CONFIG.haptics) {
            haptics.tap()
        }
    }

    function hide() {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        setPop(null)
    }

    return { pop, show, hide }
}
