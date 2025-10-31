'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { useSaladStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth'
import { BookmarkCheck, Star, Zap } from 'lucide-react'

function HomeContent() {
  const searchParams = useSearchParams()
  const session = searchParams.get('session')
  const { reset, setMode } = useSaladStore()
  const { isAuthenticated } = useAuthStore()

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
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="w-full mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Image
            src="/graphics/logo.png"
            alt="Baribali Logo"
            width={400}
            height={200}
            priority
            className="w-full h-auto"
          />
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-slate mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          בנה את הסלט המושלם שלך 🥗
        </motion.h1>
        <motion.p
          className="text-lg text-slate mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          טרי, מותאם אישית ומוכן תוך דקות
        </motion.p>

        <motion.div
          className="space-y-4 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Interactive Salad Builder - Main Feature */}
          <Link href="/size-selector">
            <motion.button
              onClick={() => handleModeSelect('interactive')}
              className="w-full h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-3xl text-xl shadow-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-4 opacity-100"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-7 h-7" />
              <span>בנה את הסלט שלך</span>
            </motion.button>
          </Link>

          {/* Saved Salads - Only if authenticated */}
          {isAuthenticated() && (
            <Link href="/saved-salads">
              <motion.button
                onClick={() => handleModeSelect('saved')}
                className="w-full h-16 bg-slate text-white font-semibold rounded-2xl text-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-3 opacity-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookmarkCheck className="w-6 h-6" />
                <span>סלט שמור</span>
              </motion.button>
            </Link>
          )}

          {/* Recommended Salad */}
          <Link href="/recommended">
            <motion.button
              onClick={() => handleModeSelect('recommended')}
              className="w-full h-16 bg-lemon text-slate font-semibold rounded-2xl text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-3 opacity-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Star className="w-6 h-6" />
              <span>סלט מומלץ</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Auth prompt if not authenticated */}
        {!isAuthenticated() && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-slate mb-4">
              התחבר כדי לשמור סלטים ולקבל המלצות אישיות
            </p>
            <Link href="/auth">
              <motion.button
                className="h-12 px-6 bg-slate text-white font-semibold rounded-2xl text-sm hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                התחברות
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
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
