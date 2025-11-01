// Dynamic Background Theme System for BariBali
// Supports both solid color gradients and image backgrounds

export type BackgroundVariant = 'hero' | 'section' | 'card' | 'modal'
export type BackgroundTheme =
    // Page themes
    | 'home' | 'builder' | 'checkout' | 'success' | 'profile'
    // Ingredient category themes
    | 'veggies' | 'proteins' | 'sauces' | 'grains' | 'premium'
    // Seasonal themes
    | 'summer' | 'winter' | 'healthy' | 'comfort'

export interface BackgroundConfig {
    type: 'gradient' | 'image'
    value: string
    overlay?: string
    parallax?: boolean
    animation?: 'none' | 'subtle' | 'dynamic'
}

export interface BackgroundStyle {
    background: string
    overlay?: string
    animation?: string
}

// Comprehensive theme definitions with image backgrounds
export const backgroundThemes: Record<BackgroundTheme, BackgroundConfig> = {
    // Page-specific themes
    home: {
        type: 'image',
        value: '/graphics/new/1920x1080.png',
        overlay: 'rgba(0, 0, 0, 0.03)', // Ultra-subtle dark tint
        parallax: false, // Remove parallax for cleaner look
        animation: 'none'
    },

    builder: {
        type: 'image',
        value: '/graphics/new/1200x800.png',
        overlay: 'rgba(240, 253, 244, 0.4)',
        parallax: false,
        animation: 'none'
    },

    checkout: {
        type: 'image',
        value: '/graphics/new/1200x800.png',
        overlay: 'rgba(254, 243, 199, 0.3)',
        parallax: false,
        animation: 'none'
    },

    success: {
        type: 'image',
        value: '/graphics/new/1920x1080.png',
        overlay: 'rgba(236, 253, 245, 0.4)',
        parallax: false,
        animation: 'dynamic'
    },

    profile: {
        type: 'image',
        value: '/graphics/new/1200x800.png',
        overlay: 'rgba(243, 244, 246, 0.5)',
        parallax: false,
        animation: 'none'
    },

    // Ingredient category themes - using gradients as fallbacks until specific images are created
    veggies: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 25%, #BBF7D0 50%, #86EFAC 75%, #4ADE80 100%)',
        overlay: 'rgba(240, 253, 244, 0.6)',
        parallax: false,
        animation: 'subtle'
    },

    proteins: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 25%, #FCD34D 50%, #F59E0B 75%, #D97706 100%)',
        overlay: 'rgba(254, 243, 199, 0.4)',
        parallax: false,
        animation: 'none'
    },

    sauces: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FEF7E6 0%, #FED7AA 25%, #FDBA74 50%, #FB923C 75%, #F97316 100%)',
        overlay: 'rgba(254, 247, 230, 0.5)',
        parallax: false,
        animation: 'subtle'
    },

    grains: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 25%, #FDE68A 50%, #FCD34D 75%, #F59E0B 100%)',
        overlay: 'rgba(255, 251, 235, 0.4)',
        parallax: false,
        animation: 'none'
    },

    premium: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 25%, #D8B4FE 50%, #C084FC 75%, #A855F7 100%)',
        overlay: 'rgba(243, 232, 255, 0.5)',
        parallax: false,
        animation: 'dynamic'
    },

    // Seasonal themes - using gradients as fallbacks until specific images are created
    summer: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 25%, #A7F3D0 50%, #6EE7B7 75%, #10B981 100%)',
        overlay: 'rgba(236, 253, 245, 0.3)',
        parallax: true,
        animation: 'subtle'
    },

    winter: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FEF7E6 0%, #FED7AA 25%, #FDBA74 50%, #FB923C 75%, #EA580C 100%)',
        overlay: 'rgba(254, 247, 230, 0.4)',
        parallax: false,
        animation: 'none'
    },

    healthy: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 25%, #BBF7D0 50%, #86EFAC 75%, #4ADE80 100%)',
        overlay: 'rgba(240, 253, 244, 0.5)',
        parallax: false,
        animation: 'subtle'
    },

    comfort: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 25%, #FCD34D 50%, #F59E0B 75%, #D97706 100%)',
        overlay: 'rgba(254, 243, 199, 0.4)',
        parallax: false,
        animation: 'none'
    }
}

// Utility functions
export function getBackgroundConfig(theme: BackgroundTheme, variant: BackgroundVariant = 'hero'): BackgroundConfig {
    const config = backgroundThemes[theme]

    // Adjust config based on variant
    switch (variant) {
        case 'card':
            return {
                ...config,
                overlay: config.overlay ? config.overlay.replace('0.', '0.7') : undefined,
                parallax: false
            }
        case 'modal':
            return {
                ...config,
                overlay: config.overlay ? config.overlay.replace('0.', '0.8') : undefined,
                parallax: false
            }
        default:
            return config
    }
}

export function getBackgroundStyle(theme: BackgroundTheme, variant: BackgroundVariant = 'hero'): BackgroundStyle {
    const config = getBackgroundConfig(theme, variant)

    const style: BackgroundStyle = {
        background: config.value
    }

    if (config.overlay) {
        style.overlay = config.overlay
    }

    return style
}

// Hook for dynamic background selection
export function useBackgroundTheme(page: string, category?: string): BackgroundTheme {
    // Page-based theming
    switch (page) {
        case 'home':
        case '/':
            return 'home'
        case 'interactive-builder':
        case 'size-selector':
            return 'builder'
        case 'slot':
        case 'checkout':
            return 'checkout'
        case 'order':
            return 'success'
        default:
            return 'home'
    }

    // Future: Category-based theming
    // if (category) {
    //   return category as BackgroundTheme
    // }
}

// Animation classes for different themes
export const backgroundAnimations = {
    none: '',
    subtle: 'animate-pulse',
    dynamic: 'animate-gradient-x'
} as const
