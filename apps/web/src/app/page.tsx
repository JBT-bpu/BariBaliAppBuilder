'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'
import { useSaladStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth'
import { sounds } from '@/lib/sounds'
import { haptics } from '@/lib/haptics'

function HomeContent() {
  const searchParams = useSearchParams()
  const session = searchParams.get('session')
  const { reset, setMode } = useSaladStore()
  const { isAuthenticated } = useAuthStore()

  // Scroll-based animations
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200])
  const logoY = useTransform(scrollY, [0, 500], [0, -50])

  // Refs for scroll animations
  const heroRef = useRef(null)
  const buttonsRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const isButtonsInView = useInView(buttonsRef, { once: true, margin: "-50px" })

  useEffect(() => {
    // Reset store on landing
    reset()
    // TODO: Load session data if session param exists
    if (session) {
      console.log('Loading session:', session)
    }
  }, [session, reset])

  const handleModeSelect = (mode: 'saved' | 'recommended' | 'interactive') => {
    setMode(mode)
    sounds.plop.play()
    haptics.success()
  }

  const handleButtonClick = () => {
    sounds.plop.play()
    haptics.success()
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <Image
          src="/graphics/new/long bg salad.png"
          alt="Salad Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-cream/60 to-cream/90" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="flex-1 flex flex-col items-center justify-center px-4 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center max-w-2xl mx-auto"
            style={{ y: logoY }}
          >
            {/* Large Logo */}
            <motion.div
              className="mb-12"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={isHeroInView ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Image
                src="/graphics/new/logo new.png"
                alt="Baribali Logo"
                width={600}
                height={200}
                priority
                className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
              />
            </motion.div>

            {/* Tagline */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate mb-4 drop-shadow-lg">
                בנה את הסלט המושלם שלך 🥗
              </h1>
              <p className="text-lg md:text-xl text-slate/80 drop-shadow">
                טרי, מותאם אישית ומוכן תוך דקות
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Buttons Section */}
        <motion.section
          ref={buttonsRef}
          className="pb-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={isButtonsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {/* Build Salad Button - Always visible */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isButtonsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/size-selector" onClick={() => handleModeSelect('interactive')}>
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/graphics/new/בנה סלט כפתור.png"
                      alt="Build Your Salad"
                      width={400}
                      height={120}
                      className="w-full h-auto rounded-3xl shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>

              {/* Saved Salads Button - Only if authenticated */}
              {isAuthenticated() && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isButtonsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/saved-salads" onClick={() => handleModeSelect('saved')}>
                    <div className="relative group cursor-pointer">
                      <Image
                        src="/graphics/new/שלטים שמורים כפתור.png"
                        alt="Saved Salads"
                        width={400}
                        height={120}
                        className="w-full h-auto rounded-3xl shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Recommended Button - Always visible */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isButtonsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/recommended" onClick={() => handleModeSelect('recommended')}>
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/graphics/new/המומלצים שלנו.png"
                      alt="Our Recommended"
                      width={400}
                      height={120}
                      className="w-full h-auto rounded-3xl shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>

              {/* Login Button - Always visible */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isButtonsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/auth" onClick={handleButtonClick}>
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/graphics/new/התחברות משתמש.png"
                      alt="User Login"
                      width={400}
                      height={120}
                      className="w-full h-auto rounded-3xl shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Auth prompt if not authenticated */}
            {!isAuthenticated() && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isButtonsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <p className="text-sm text-slate/70 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30 shadow-lg">
                  התחבר כדי לשמור סלטים ולקבל המלצות אישיות
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-slate/40 rounded-full flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1 h-2 bg-slate/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
