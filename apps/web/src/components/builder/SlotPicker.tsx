'use client';

import React, { useState, useEffect } from 'react';
import { format, addMinutes, startOfDay, isToday, isTomorrow } from 'date-fns';
import { he } from 'date-fns/locale/he';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { cn } from '@/lib/utils';

interface Slot {
    id: string;
    time: Date;
    capacity: number;
    available: number;
    isAvailable: boolean;
}

interface SlotPickerProps {
    selectedSlot?: string;
    onSlotSelect: (slotId: string) => void;
    className?: string;
}

// Generate 15-minute slots from 11:00 to 22:00
function generateSlotsForDay(baseDate: Date): Slot[] {
    const slots: Slot[] = [];
    const startHour = 11;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const slotTime = new Date(baseDate);
            slotTime.setHours(hour, minute, 0, 0);

            // Skip past slots for today
            if (isToday(baseDate) && slotTime <= new Date()) {
                continue;
            }

            const slotId = `slot-${format(slotTime, 'yyyy-MM-dd-HH-mm')}`;
            const capacity = Math.floor(Math.random() * 10) + 5; // Mock capacity 5-15
            const available = Math.floor(Math.random() * capacity); // Mock availability

            slots.push({
                id: slotId,
                time: slotTime,
                capacity,
                available,
                isAvailable: available > 0,
            });
        }
    }

    return slots;
}

function getDayLabel(date: Date): string {
    if (isToday(date)) return 'היום';
    if (isTomorrow(date)) return 'מחר';
    return format(date, 'EEEE', { locale: he });
}

export function SlotPicker({ selectedSlot, onSlotSelect, className }: SlotPickerProps) {
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedDay, setSelectedDay] = useState(0);

    // Generate slots for next 3 days
    useEffect(() => {
        const loadSlots = async () => {
            setLoading(true);

            try {
                // Fetch slots from API
                const response = await fetch('/api/slots');

                if (!response.ok) {
                    throw new Error(`Failed to fetch slots: ${response.status}`);
                }

                const data = await response.json();

                if (data.slots) {
                    // Convert grouped slots back to flat array
                    const allSlots: Slot[] = [];

                    Object.entries(data.slots).forEach(([date, daySlots]: [string, any]) => {
                        (daySlots as any[]).forEach((slot: any) => {
                            allSlots.push({
                                id: slot.id,
                                time: new Date(slot.slot_time),
                                capacity: slot.capacity,
                                available: slot.available,
                                isAvailable: slot.available > 0,
                            });
                        });
                    });

                    setSlots(allSlots);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.warn('Failed to fetch slots from API, using fallback:', error);

                // Fallback: Generate slots client-side
                const today = startOfDay(new Date());
                const allSlots: Slot[] = [];

                for (let day = 0; day < 3; day++) {
                    const dayDate = addMinutes(today, day * 24 * 60);
                    allSlots.push(...generateSlotsForDay(dayDate));
                }

                setSlots(allSlots);
            } finally {
                setLoading(false);
            }
        };

        loadSlots();
    }, []);

    const days = [
        { label: 'היום', date: new Date() },
        { label: 'מחר', date: addMinutes(new Date(), 24 * 60) },
        { label: format(addMinutes(new Date(), 2 * 24 * 60), 'EEEE', { locale: he }), date: addMinutes(new Date(), 2 * 24 * 60) },
    ];

    const currentDaySlots = slots.filter(slot => {
        const slotDay = startOfDay(slot.time);
        const targetDay = startOfDay(days[selectedDay].date);
        return slotDay.getTime() === targetDay.getTime();
    });

    if (loading) {
        return (
            <div className={cn('space-y-4', className)}>
                <div className="flex gap-2">
                    {Array.from({ length: 3 }, (_, i) => (
                        <LoadingSkeleton key={i} variant="chip" width={60} />
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }, (_, i) => (
                        <LoadingSkeleton key={i} variant="chip" height={48} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Time slots grid - no day selector, today only */}
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {currentDaySlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    const isUnavailable = !slot.isAvailable;

                    return (
                        <Button
                            key={slot.id}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            disabled={isUnavailable}
                            onClick={() => slot.isAvailable && onSlotSelect(slot.id)}
                            className={cn(
                                'h-12 flex flex-col items-center justify-center text-xs',
                                isUnavailable && 'opacity-50 cursor-not-allowed',
                                isSelected && 'ring-2 ring-green ring-offset-1'
                            )}
                        >
                            <div className="font-medium">
                                {format(slot.time, 'HH:mm')}
                            </div>
                        </Button>
                    );
                })}
            </div>

            {currentDaySlots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>אין זמני איסוף זמינים ליום זה</p>
                </div>
            )}
        </div>
    );
}
