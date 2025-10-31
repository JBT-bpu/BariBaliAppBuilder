'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxLayer {
    src?: string;
    speed: number;
    opacity?: number;
    scale?: number;
    className?: string;
}

interface ParallaxBackgroundProps {
    layers?: ParallaxLayer[];
    className?: string;
    children?: React.ReactNode;
}

export function ParallaxBackground({
    layers = [],
    className,
    children
}: ParallaxBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Default layers if none provided
    const defaultLayers: ParallaxLayer[] = [
        {
            speed: 0.5,
            opacity: 0.1,
            className: 'bg-gradient-to-br from-green-100 via-blue-50 to-purple-50'
        },
        {
            speed: 0.3,
            opacity: 0.05,
            className: 'bg-gradient-to-tl from-yellow-100 via-orange-50 to-red-50'
        },
        {
            speed: 0.2,
            opacity: 0.03,
            className: 'bg-gradient-to-r from-pink-100 via-purple-50 to-indigo-50'
        }
    ];

    const activeLayers = layers.length > 0 ? layers : defaultLayers;

    return (
        <div
            ref={containerRef}
            className={cn('relative overflow-hidden', className)}
        >
            {/* Parallax layers */}
            {activeLayers.map((layer, index) => {
                const y = useTransform(scrollYProgress, [0, 1], [0, -layer.speed * 100]);
                const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + (layer.scale || 0)]);

                return (
                    <motion.div
                        key={index}
                        className={cn(
                            'absolute inset-0 pointer-events-none',
                            layer.className
                        )}
                        style={{
                            y,
                            scale,
                            opacity: layer.opacity || 0.1,
                        }}
                    >
                        {layer.src ? (
                            <img
                                src={layer.src}
                                alt=""
                                className="w-full h-full object-cover"
                                style={{
                                    filter: 'blur(1px)',
                                }}
                            />
                        ) : null}
                    </motion.div>
                );
            })}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Subtle overlay for better text readability */}
            <motion.div
                className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none z-[5]"
                style={{
                    opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.1])
                }}
            />
        </div>
    );
}

// Hook for using parallax in components
export function useParallax(value: number, distance: number = 100) {
    const { scrollY } = useScroll();
    return useTransform(scrollY, [0, distance], [0, -value]);
}

// Utility component for simple parallax images
export function ParallaxImage({
    src,
    alt,
    speed = 0.5,
    className,
}: {
    src: string;
    alt: string;
    speed?: number;
    className?: string;
}) {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -speed * 100]);

    return (
        <motion.img
            src={src}
            alt={alt}
            className={className}
            style={{
                y,
            }}
        />
    );
}
