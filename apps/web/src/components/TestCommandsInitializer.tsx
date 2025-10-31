'use client';

import { useEffect } from 'react';
import { initTestCommands } from '@/lib/testOrderSimulation';

/**
 * Client component that initializes test commands on mount
 * This makes testing utilities available in the browser console
 */
export function TestCommandsInitializer() {
    useEffect(() => {
        initTestCommands();
    }, []);

    return null;
}
