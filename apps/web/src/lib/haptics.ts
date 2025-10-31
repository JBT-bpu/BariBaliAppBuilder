// Haptic feedback utilities for mobile devices

export const haptics = {
    // Light tap feedback
    tap: () => {
        if (navigator.vibrate) {
            navigator.vibrate(50)
        }
    },

    // Medium feedback for selections
    select: () => {
        if (navigator.vibrate) {
            navigator.vibrate(100)
        }
    },

    // Strong feedback for important actions
    success: () => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
        }
    },

    // Error feedback
    error: () => {
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
        }
    }
}

// Enhanced click handler with haptic feedback
export const withHaptics = (handler: () => void, type: 'tap' | 'select' | 'success' | 'error' = 'tap') => {
    return () => {
        haptics[type]()
        handler()
    }
}
