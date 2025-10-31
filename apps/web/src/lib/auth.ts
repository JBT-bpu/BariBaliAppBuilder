import { create } from 'zustand'

interface AuthStore {
    phone: string | null
    token: string | null
    customerId: string | null

    login: (phone: string, code: string) => Promise<void>
    logout: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    phone: null,
    token: null,
    customerId: null,

    login: async (phone: string, code: string) => {
        // TODO: Implement actual WhatsApp verification
        // For now, mock authentication
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock successful login
            const mockToken = 'mock-jwt-token-' + Date.now()
            const mockCustomerId = 'customer-' + phone.replace(/\D/g, '')

            localStorage.setItem('auth-token', mockToken)
            localStorage.setItem('customer-id', mockCustomerId)
            localStorage.setItem('phone', phone)

            set({
                phone,
                token: mockToken,
                customerId: mockCustomerId
            })
        } catch (error) {
            throw new Error('Authentication failed')
        }
    },

    logout: () => {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('customer-id')
        localStorage.removeItem('phone')

        set({
            phone: null,
            token: null,
            customerId: null
        })
    },

    isAuthenticated: () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null)
        return !!token
    }
}))

// Initialize auth state from localStorage on app start
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    const customerId = localStorage.getItem('customer-id')
    const phone = localStorage.getItem('phone')

    if (token && customerId && phone) {
        useAuthStore.setState({
            token,
            customerId,
            phone
        })
    }
}
