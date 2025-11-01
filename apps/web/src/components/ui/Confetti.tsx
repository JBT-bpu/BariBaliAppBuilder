'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
    isActive: boolean
    duration?: number
    particleCount?: number
    onComplete?: () => void
}

interface Particle {
    id: number
    x: number
    y: number
    rotation: number
    scale: number
    color: string
    velocity: {
        x: number
        y: number
    }
    rotationSpeed: number
}

export function Confetti({ isActive, duration = 3000, particleCount = 100, onComplete }: ConfettiProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)
    const particlesRef = useRef<Particle[]>([])
    const startTimeRef = useRef<number | undefined>(undefined)

    const colors = [
        '#FF6B9D', // Pink
        '#4ECDC4', // Teal
        '#FFD93B', // Yellow
        '#FF8B42', // Orange
        '#A78BFA', // Purple
        '#34D399', // Green
        '#F87171', // Red
        '#60A5FA', // Blue
    ]

    const createParticles = () => {
        const particles: Particle[] = []
        const width = typeof window !== 'undefined' ? window.innerWidth : 1920
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                id: i,
                x: Math.random() * width,
                y: -10,
                rotation: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                velocity: {
                    x: (Math.random() - 0.5) * 8,
                    y: Math.random() * 3 + 2
                },
                rotationSpeed: (Math.random() - 0.5) * 10
            })
        }
        particlesRef.current = particles
    }

    const updateParticles = (deltaTime: number) => {
        const height = typeof window !== 'undefined' ? window.innerHeight : 1080
        particlesRef.current = particlesRef.current.map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x * deltaTime,
            y: particle.y + particle.velocity.y * deltaTime,
            rotation: particle.rotation + particle.rotationSpeed * deltaTime,
            velocity: {
                ...particle.velocity,
                y: particle.velocity.y + 0.1 // gravity
            }
        })).filter(particle => particle.y < height + 50)
    }

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1920
        const height = typeof window !== 'undefined' ? window.innerHeight : 1080
        ctx.clearRect(0, 0, width, height)

        particlesRef.current.forEach(particle => {
            ctx.save()
            ctx.translate(particle.x, particle.y)
            ctx.rotate((particle.rotation * Math.PI) / 180)
            ctx.scale(particle.scale, particle.scale)

            // Draw confetti piece
            ctx.fillStyle = particle.color
            ctx.fillRect(-3, -1, 6, 2)

            ctx.restore()
        })
    }

    const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = currentTime
        }

        const elapsed = currentTime - startTimeRef.current

        if (elapsed > duration) {
            onComplete?.()
            return
        }

        updateParticles(16 / 1000) // ~60fps

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            drawParticles(ctx)
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (isActive && typeof window !== 'undefined') {
            const canvas = canvasRef.current
            if (!canvas) return

            // Set canvas size
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Create particles
            createParticles()
            startTimeRef.current = undefined

            // Start animation
            animationRef.current = requestAnimationFrame(animate)
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            particlesRef.current = []
            startTimeRef.current = undefined
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isActive, duration, particleCount])

    if (!isActive) return null

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ mixBlendMode: 'multiply' }}
        />
    )
}

// React component version for simpler use
export function ConfettiSimple({ isActive, onComplete }: { isActive: boolean, onComplete?: () => void }) {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: ['#FF6B9D', '#4ECDC4', '#FFD93B', '#FF8B42', '#A78BFA'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        left: Math.random() * 100,
        delay: Math.random() * 2
    }))

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {isActive && particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.left}%`,
                        top: '-20px',
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        borderRadius: '2px'
                    }}
                    initial={{ y: -20, rotate: 0 }}
                    animate={{
                        y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 20,
                        rotate: 360,
                        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: particle.delay,
                        ease: 'easeOut'
                    }}
                    onAnimationComplete={() => {
                        if (particle.id === particles.length - 1) {
                            onComplete?.()
                        }
                    }}
                />
            ))}
        </div>
    )
}
