import { createClient } from '@supabase/supabase-js';

// Database types (generated from Supabase schema)
export interface Database {
    public: {
        Tables: {
            orders: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    order_id: string;
                    customer_wa: string | null;
                    size: string;
                    items: {
                        veggies: string[];
                        sauces: string[];
                        primary_extra: string | null;
                        paid_additions: string[];
                        side: string | null;
                        mixing: string;
                    };
                    totals: {
                        price: number;
                        kcal: number;
                        protein: number;
                        carbs: number;
                        fat: number;
                    };
                    pickup_slot: string;
                    payment_id: string | null;
                    payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
                    status: 'pending_payment' | 'paid' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
                    notes: string | null;
                    source: 'web' | 'whatsapp' | 'pos';
                };
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['orders']['Insert']>;
            };
            slots: {
                Row: {
                    id: string;
                    slot_time: string;
                    capacity: number;
                    available: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['slots']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['slots']['Insert']>;
            };
            menu_items: {
                Row: {
                    id: string;
                    name_he: string;
                    name_en: string;
                    category: string;
                    price_delta: number | null;
                    unit_price: number | null;
                    icon: string;
                    nutrition: {
                        grams_per_scoop: number;
                        per_100g: {
                            kcal: number;
                            protein: number;
                            carbs: number;
                            fat: number;
                            fiber: number;
                        };
                        source: string;
                    } | null;
                    facts: string[] | null;
                    tags: string[] | null;
                    rarity: 'common' | 'premium' | 'rare';
                    is_active: boolean;
                    sort_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['menu_items']['Insert']>;
            };
            user_preferences: {
                Row: {
                    id: string;
                    user_id: string;
                    favorite_slots: string[];
                    saved_salads: any[];
                    language: 'he' | 'en';
                    notifications_enabled: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_preferences']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>;
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            order_status: 'pending_payment' | 'paid' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
            payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
            order_source: 'web' | 'whatsapp' | 'pos';
            item_rarity: 'common' | 'premium' | 'rare';
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}

// Supabase configuration for Bari Bali salad ordering
// Handles orders, slots, menu data, and user preferences

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;

// Create Supabase client lazily to avoid build-time errors
export function getSupabaseClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials not found. Using mock client for development.');
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
        });
    }

    return supabaseClient;
}

// For backward compatibility, export a getter that returns the client
export const supabase = getSupabaseClient();

// Helper functions for common operations
export class SupabaseHelpers {
    private static getClient() {
        const client = getSupabaseClient();
        if (!client) {
            throw new Error('Supabase client not available. Check your environment variables.');
        }
        return client;
    }

    // Orders
    static async createOrder(orderData: any) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateOrderStatus(orderId: string, status: any) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('order_id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getOrderById(orderId: string) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();

        if (error) throw error;
        return data;
    }

    // Slots
    static async getAvailableSlots(date?: string) {
        const supabase = this.getClient() as any;
        let query = supabase
            .from('slots')
            .select('*')
            .eq('is_active', true)
            .order('slot_time', { ascending: true });

        if (date) {
            // Filter by date (assuming slot_time is stored as ISO string)
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query = query
                .gte('slot_time', startOfDay.toISOString())
                .lte('slot_time', endOfDay.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async updateSlotCapacity(slotId: string, newAvailable: number) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('slots')
            .update({
                available: newAvailable,
                updated_at: new Date().toISOString()
            })
            .eq('id', slotId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Menu
    static async getActiveMenuItems() {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data;
    }

    // User preferences
    static async getUserPreferences(userId: string) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data;
    }

    static async upsertUserPreferences(userId: string, preferences: any) {
        const supabase = this.getClient() as any;
        const { data, error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: userId,
                ...preferences,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

// Mock data for development (when Supabase is not configured)
function generateMockSlots() {
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate slots for today only: 10:00 - 16:00 (1 slot per hour)
    for (let hour = 10; hour < 16; hour++) {
        const slotTime = new Date(today);
        slotTime.setHours(hour, 0, 0, 0);

        // Skip past slots for today
        const now = new Date();
        if (slotTime <= now) {
            continue;
        }

        slots.push({
            id: `slot-${slotTime.toISOString().split('T')[0]}-${String(hour).padStart(2, '0')}-00`,
            slot_time: slotTime.toISOString(),
            capacity: 1,
            available: 1,
            is_active: true,
        });
    }

    return slots;
}

export const mockData = {
    slots: generateMockSlots(),
    orders: [],
};
