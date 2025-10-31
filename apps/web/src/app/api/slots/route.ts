import { NextRequest, NextResponse } from 'next/server';
import { SupabaseHelpers, mockData } from '@/lib/supabase';
import { format, addMinutes, startOfDay, isToday, isTomorrow } from 'date-fns';

// Get available pickup slots
// Returns slots with capacity information for the next few days

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Optional date filter (YYYY-MM-DD)

    try {
        let slots;

        // Try to get slots from Supabase
        try {
            slots = await SupabaseHelpers.getAvailableSlots(date || undefined);
        } catch (dbError) {
            console.warn('Database not available, using mock data:', dbError);

            // Fallback to mock data for development
            if (date) {
                // Filter mock data by date
                const targetDate = startOfDay(new Date(date));
                slots = mockData.slots.filter(slot => {
                    const slotDate = startOfDay(new Date(slot.slot_time));
                    return slotDate.getTime() === targetDate.getTime();
                });
            } else {
                slots = mockData.slots;
            }
        }

        // If no slots found and no date specified, generate default slots
        if (slots.length === 0 && !date) {
            slots = generateDefaultSlots();
        }

        // Group slots by date for easier frontend consumption
        const groupedSlots = groupSlotsByDate(slots);

        return NextResponse.json({
            success: true,
            slots: groupedSlots,
            total: slots.length,
        });

    } catch (error) {
        console.error('Slots fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch available slots' },
            { status: 500 }
        );
    }
}

// Generate default slots for development/demo
function generateDefaultSlots() {
    const slots = [];
    const today = startOfDay(new Date());

    // Generate slots for next 3 days
    for (let day = 0; day < 3; day++) {
        const dayDate = addMinutes(today, day * 24 * 60);

        // Business hours: 11:00 - 22:00, 10-minute intervals
        for (let hour = 11; hour < 22; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const slotTime = new Date(dayDate);
                slotTime.setHours(hour, minute, 0, 0);

                // Skip past slots for today
                if (isToday(dayDate) && slotTime <= new Date()) {
                    continue;
                }

                const capacity = 3; // 3 salads per slot
                const available = 3; // Always have availability for demo

                slots.push({
                    id: `slot-${format(slotTime, 'yyyy-MM-dd-HH-mm')}`,
                    slot_time: slotTime.toISOString(),
                    capacity,
                    available,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            }
        }
    }

    return slots;
}

// Group slots by date for frontend
function groupSlotsByDate(slots: any[]) {
    const grouped: Record<string, any[]> = {};

    slots.forEach(slot => {
        const date = format(new Date(slot.slot_time), 'yyyy-MM-dd');
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(slot);
    });

    // Sort slots within each day by time
    Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) =>
            new Date(a.slot_time).getTime() - new Date(b.slot_time).getTime()
        );
    });

    return grouped;
}
