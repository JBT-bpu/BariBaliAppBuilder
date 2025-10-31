// Design tokens for Bari Bali - dense, mobile-first salad builder
// 8px grid system, compact typography, Hebrew RTL aware

export const colors = {
    // Primary brand colors (from spec)
    green: '#5AC568',
    lemon: '#FFD93B',
    ink: '#0A3D2E',
    bg: '#FAFAF5',
    glass: 'rgba(255,255,255,.92)',

    // Semantic colors
    success: '#5AC568',
    warning: '#FFD93B',
    error: '#E53E3E',
    info: '#4299E1',

    // Grays for UI elements
    gray50: '#F7FAFC',
    gray100: '#EDF2F7',
    gray200: '#E2E8F0',
    gray300: '#CBD5E0',
    gray400: '#A0AEC0',
    gray500: '#718096',
    gray600: '#4A5568',
    gray700: '#2D3748',
    gray800: '#1A202C',
    gray900: '#171923',
} as const;

// Premium category gradients with enhanced colors
export const categoryGradients = {
    veggies: 'linear-gradient(135deg, #5AC568 0%, #4DB858 100%)',
    proteins: 'linear-gradient(135deg, #4299E1 0%, #3182CE 100%)',
    grains: 'linear-gradient(135deg, #F6AD55 0%, #DD6B20 100%)',
    sauces: 'linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)',
    paid: 'linear-gradient(135deg, #FFD93B 0%, #F6B93B 100%)',
    // Enhanced premium gradients
    veggiePremium: 'linear-gradient(135deg, #5AC568 0%, #4DB858 50%, #3FA84A 100%)',
    proteinPremium: 'linear-gradient(135deg, #4299E1 0%, #3182CE 50%, #2C5282 100%)',
    saucePremium: 'linear-gradient(135deg, #9F7AEA 0%, #805AD5 50%, #6B46C1 100%)',
    breadPremium: 'linear-gradient(135deg, #F6AD55 0%, #DD6B20 50%, #C05621 100%)',
    addonPremium: 'linear-gradient(135deg, #FFD93B 0%, #F6B93B 50%, #ED8936 100%)',
} as const;

// Enhanced category color system for visual differentiation
export const categoryColors = {
    veggies: {
        primary: '#10B981', // Fresh green
        secondary: '#059669',
        light: '#D1FAE5',
        dark: '#047857',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        glow: 'rgba(16, 185, 129, 0.3)',
    },
    sauces: {
        primary: '#F59E0B', // Warm orange
        secondary: '#D97706',
        light: '#FEF3C7',
        dark: '#B45309',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        glow: 'rgba(245, 158, 11, 0.3)',
    },
    extras: {
        primary: '#8B5CF6', // Purple
        secondary: '#6D28D9',
        light: '#EDE9FE',
        dark: '#5B21B6',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        glow: 'rgba(139, 92, 246, 0.3)',
    },
    premium: {
        primary: '#FBBF24', // Gold
        secondary: '#D97706',
        light: '#FEF3C7',
        dark: '#92400E',
        gradient: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
        glow: 'rgba(251, 191, 36, 0.3)',
    },
} as const;

export const spacing = {
    // 8px grid system
    0: '0px',
    1: '4px',    // xs
    2: '8px',    // sm
    3: '12px',   // md
    4: '16px',   // lg
    5: '20px',   // xl
    6: '24px',   // 2xl
    8: '32px',   // 3xl
    10: '40px',  // 4xl
    12: '48px',  // 5xl
    16: '64px',  // 6xl
    20: '80px',  // 7xl
    24: '96px',  // 8xl
} as const;

export const fontSize = {
    // Compact typography for dense UI
    xs: ['12px', { lineHeight: '1.1' }],
    sm: ['13px', { lineHeight: '1.2' }],
    base: ['14px', { lineHeight: '1.3' }],
    lg: ['15px', { lineHeight: '1.3' }],
    xl: ['16px', { lineHeight: '1.4' }],
    '2xl': ['18px', { lineHeight: '1.4' }],
    '3xl': ['20px', { lineHeight: '1.4' }],
} as const;

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

export const borderRadius = {
    none: '0px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
} as const;

export const shadows = {
    // Enhanced shadow hierarchy for premium depth
    sm: '0 1px 2px 0 rgba(10, 61, 46, 0.06)',
    md: '0 4px 6px -1px rgba(10, 61, 46, 0.08), 0 2px 4px -1px rgba(10, 61, 46, 0.06)',
    lg: '0 10px 15px -3px rgba(10, 61, 46, 0.08), 0 4px 6px -2px rgba(10, 61, 46, 0.06)',
    xl: '0 20px 25px -5px rgba(10, 61, 46, 0.08), 0 10px 10px -5px rgba(10, 61, 46, 0.06)',
    '2xl': '0 25px 50px -12px rgba(10, 61, 46, 0.15)',
    '3xl': '0 35px 60px -12px rgba(10, 61, 46, 0.15)',
    '4xl': '0 45px 80px -12px rgba(10, 61, 46, 0.15)',
    '5xl': '0 55px 100px -12px rgba(10, 61, 46, 0.15)',
    // Inner shadows for depth
    inner: 'inset 0 2px 4px 0 rgba(10, 61, 46, 0.06)',
    innerLg: 'inset 0 4px 8px 0 rgba(10, 61, 46, 0.08)',
} as const;

export const transitions = {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
} as const;

// Animation presets for micro-interactions
export const animations = {
    spring: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    },
    bounce: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
    },
    chipTap: {
        scale: [1, 0.95, 1],
        transition: { duration: 0.15 },
    },
    // Premium animation presets
    smooth: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
    },
    gentle: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
    },
    quick: {
        type: 'spring',
        stiffness: 500,
        damping: 35,
    },
} as const;

// Animation timing functions and easing curves
export const easing = {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Backdrop blur values for glassmorphism
export const backdropBlur = {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(12px)',
    xl: 'blur(16px)',
    '2xl': 'blur(24px)',
} as const;

// Z-index scale for layering
export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
} as const;

// Component-specific tokens
export const components = {
    chip: {
        height: '44px',
        paddingX: spacing[3],
        paddingY: spacing[1],
        borderRadius: borderRadius.lg,
        fontSize: fontSize.sm,
    },
    button: {
        height: '44px',
        paddingX: spacing[4],
        borderRadius: borderRadius.lg,
    },
    input: {
        height: '44px',
        paddingX: spacing[3],
        borderRadius: borderRadius.md,
    },
    sheet: {
        borderRadius: borderRadius.xl,
        shadow: shadows.lg,
    },
} as const;
