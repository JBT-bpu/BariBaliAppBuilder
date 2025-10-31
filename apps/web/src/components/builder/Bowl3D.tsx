'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import { useSaladStore } from '@/lib/store'
import { Icon } from '@iconify/react'
import * as THREE from 'three'

// Lightweight fallback bowl (simple geometry)
function FallbackBowl({ isMixing }: { isMixing: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            if (isMixing) {
                meshRef.current.rotation.y += delta * 8 // Fast rotation
                meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 15) * 0.15
                meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 15) * 0.15
            } else {
                meshRef.current.rotation.y += delta * 0.3 // Slow rotation
                meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.03
                meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.03
            }
        }
    })

    return (
        <mesh ref={meshRef} position={[0, -0.5, 0]}>
            <torusGeometry args={[2, 0.8, 16, 32]} />
            <meshStandardMaterial
                color="#8B5CF6"
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}

// GLB Bowl component with error handling
function GLBBowl({ isMixing, onError }: { isMixing: boolean; onError: () => void }) {
    const meshRef = useRef<THREE.Group>(null)

    try {
        const { scene } = useGLTF('/3d/bowl.glb')

        useFrame((state, delta) => {
            if (meshRef.current) {
                if (isMixing) {
                    meshRef.current.rotation.y += delta * 8
                    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 15) * 0.15
                    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 15) * 0.15
                } else {
                    meshRef.current.rotation.y += delta * 0.3
                    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.03
                    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.03
                }
            }
        })

        return (
            <primitive
                ref={meshRef}
                object={scene}
                scale={[1.5, 1.5, 1.5]}
                position={[0, -0.8, 0]}
            />
        )
    } catch (error) {
        console.warn('GLB loading failed, using fallback:', error)
        onError()
        return <FallbackBowl isMixing={isMixing} />
    }
}

// Simplified ingredient visualization (no Html overlays for performance)
function IngredientParticles({ ingredients, isMixing }: { ingredients: string[]; isMixing: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current && isMixing) {
            groupRef.current.rotation.y += 0.05
        }
    })

    return (
        <group ref={groupRef}>
            {ingredients.slice(0, 8).map((_, index) => {
                const angle = (index / Math.min(ingredients.length, 8)) * Math.PI * 2
                const radius = 1.2
                const x = Math.cos(angle) * radius
                const z = Math.sin(angle) * radius

                return (
                    <mesh
                        key={index}
                        position={[x, -0.3 + Math.random() * 0.4, z]}
                        scale={isMixing ? [1.3, 1.3, 1.3] : [1, 1, 1]}
                    >
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial
                            color={isMixing ? '#10B981' : '#6B7280'}
                            emissive={isMixing ? '#10B981' : '#000000'}
                            emissiveIntensity={isMixing ? 0.2 : 0}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

// Main Bowl3D component with error handling and fallback
export default function Bowl3D() {
    const { ingredients, toppings, sauces, bread } = useSaladStore()
    const [isMixing, setIsMixing] = useState(false)
    const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error' | 'fallback'>('loading')
    const [showFallback, setShowFallback] = useState(false)

    // Timeout for loading
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loadingState === 'loading') {
                console.warn('3D bowl loading timeout, switching to fallback')
                setLoadingState('fallback')
                setShowFallback(true)
            }
        }, 5000) // 5 second timeout

        return () => clearTimeout(timeout)
    }, [loadingState])

    // Listen for mixing state
    useEffect(() => {
        const handleMixingStart = () => setIsMixing(true)
        const handleMixingEnd = () => setIsMixing(false)

        window.addEventListener('mixing-start', handleMixingStart)
        window.addEventListener('mixing-end', handleMixingEnd)

        return () => {
            window.removeEventListener('mixing-start', handleMixingStart)
            window.removeEventListener('mixing-end', handleMixingEnd)
        }
    }, [])

    const handleGLBError = () => {
        setLoadingState('error')
        setShowFallback(true)
    }

    const allIngredients = [...ingredients, ...toppings, ...sauces]

    return (
        <div className="w-full h-96 relative">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-cream/50 backdrop-blur-sm rounded-2xl">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                        <p className="text-xs text-slate/70">טוען...</p>
                    </div>
                </div>
            }>
                <Canvas
                    camera={{ position: [0, 2, 5], fov: 50 }}
                    style={{ background: 'transparent' }}
                    onCreated={() => setLoadingState('loaded')}
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} />
                    <pointLight position={[-5, -5, -5]} intensity={0.4} />

                    {/* Bowl */}
                    {showFallback ? (
                        <FallbackBowl isMixing={isMixing} />
                    ) : (
                        <GLBBowl isMixing={isMixing} onError={handleGLBError} />
                    )}

                    {/* Ingredient particles */}
                    <IngredientParticles ingredients={allIngredients} isMixing={isMixing} />

                    {/* Bread indicator */}
                    {bread && (
                        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
                            <div className="bg-amber-100 rounded-full p-2 shadow-lg border border-amber-200">
                                <Icon
                                    icon={bread === 'bread' ? 'noto:bread' : 'openmoji_croutons'}
                                    className="w-5 h-5 text-amber-700"
                                />
                            </div>
                        </Html>
                    )}
                </Canvas>
            </Suspense>

            {/* Loading/Error overlay */}
            {loadingState === 'loading' && !showFallback && (
                <div className="absolute inset-0 flex items-center justify-center bg-cream/50 backdrop-blur-sm rounded-2xl">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-slate/70">טוען קערה תלת מימדית...</p>
                        <p className="text-xs text-slate/50 mt-2">אם לוקח זמן, יוצג קערה חלופית</p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {loadingState === 'error' && (
                <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                        ⚠️ קערה תלת מימדית לא נטענה. מציג קערה חלופית.
                    </p>
                </div>
            )}
        </div>
    )
}

// Remove GLB preload to avoid blocking
// useGLTF.preload('/3d/bowl.glb')
