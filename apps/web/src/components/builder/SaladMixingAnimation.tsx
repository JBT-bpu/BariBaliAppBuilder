'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { shadows, animations } from '@/ui/tokens';

interface SaladMixingAnimationProps {
    isVisible: boolean;
    onComplete: () => void;
    className?: string;
}

interface MixingParticle {
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    icon: string;
    delay: number;
}

export function SaladMixingAnimation({
    isVisible,
    onComplete,
    className
}: SaladMixingAnimationProps) {
    const [particles, setParticles] = useState<MixingParticle[]>([]);

    // Generate random particles when animation starts
    useEffect(() => {
        if (isVisible) {
            const newParticles: MixingParticle[] = [];
            const particleTypes = [
                { color: '#10B981', icon: 'mdi:leaf' }, // Veggies - green
                { color: '#F59E0B', icon: 'mdi:water' }, // Sauces - orange
                { color: '#8B5CF6', icon: 'mdi:star' }, // Extras - purple
                { color: '#FBBF24', icon: 'mdi:crown' }, // Premium - gold
                { color: '#EF4444', icon: 'mdi:heart' }, // Tomato
                { color: '#F97316', icon: 'mdi:carrot' }, // Carrot
                { color: '#84CC16', icon: 'mdi:cucumber' }, // Cucumber
            ];

            for (let i = 0; i < 15; i++) {
                const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                newParticles.push({
                    id: `particle-${i}`,
                    x: Math.random() * 200 - 100, // -100 to 100
                    y: Math.random() * 200 - 100,
                    size: Math.random() * 20 + 15, // 15-35px
                    color: type.color,
                    icon: type.icon,
                    delay: Math.random() * 0.5,
                });
            }
            setParticles(newParticles);

            // Complete animation after 3 seconds
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={cn(
                        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
                        className
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Bowl container */}
                    <motion.div
                        className="relative w-64 h-64 flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Bowl background */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-white/20 bg-gradient-to-br from-white/10 to-white/5"
                            style={{
                                boxShadow: shadows['2xl'],
                                backdropFilter: 'blur(20px)',
                            }}
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />

                        {/* Bowl rim */}
                        <motion.div
                            className="absolute inset-2 rounded-full border-2 border-white/30"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        {/* Mixing particles */}
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute flex items-center justify-center"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    width: particle.size,
                                    height: particle.size,
                                }}
                                initial={{
                                    x: particle.x,
                                    y: particle.y,
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: [particle.x, particle.x + 20, particle.x - 15, particle.x],
                                    y: [particle.y, particle.y - 25, particle.y + 20, particle.y],
                                    scale: [0, 1, 0.8, 1],
                                    opacity: [0, 1, 0.7, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 2.5,
                                    delay: particle.delay,
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                    ease: 'easeInOut',
                                }}
                            >
                                <div
                                    className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                                    style={{
                                        backgroundColor: particle.color,
                                        boxShadow: `0 4px 12px ${particle.color}40`,
                                    }}
                                >
                                    <Icon
                                        icon={particle.icon}
                                        className="w-3/4 h-3/4 text-white"
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Central mixing spoon effect */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <Icon
                                    icon="mdi:silverware-variant"
                                    className="w-8 h-8 text-white"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Mixing text */}
                        <motion.div
                            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.h3
                                className="text-xl font-bold text-white mb-1"
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                מערבב את הסלט...
                            </motion.h3>
                            <p className="text-white/80 text-sm">
                                מכין את הסלט המושלם בשבילך
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Loading dots */}
                    <motion.div
                        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-white rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
