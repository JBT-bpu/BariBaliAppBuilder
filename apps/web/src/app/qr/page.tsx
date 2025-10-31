'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'

export default function QRPage() {
    const [localIP, setLocalIP] = useState<string>('')
    const [qrUrl, setQrUrl] = useState<string>('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Get local IP from window location
        const hostname = window.location.hostname
        const port = window.location.port || '3000'

        // If accessing from localhost, show instructions
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            setLocalIP('localhost')
            setQrUrl(`http://localhost:${port}`)
        } else {
            // Already on network IP
            setLocalIP(hostname)
            setQrUrl(`http://${hostname}:${port}`)
        }
    }, [])

    const downloadQR = () => {
        const qrElement = document.querySelector('canvas')
        if (qrElement) {
            const url = qrElement.toDataURL('image/png')
            const link = document.createElement('a')
            link.href = url
            link.download = 'baribali-qr-code.png'
            link.click()
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
            <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">🥗 בה לי</h1>
                    <p className="text-slate-600">Scan to Order</p>
                </div>

                {/* QR Code */}
                <motion.div
                    className="bg-white p-6 rounded-2xl border-2 border-green-200 flex justify-center mb-8"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {qrUrl && (
                        <QRCodeSVG
                            value={qrUrl}
                            size={256}
                            level="H"
                            includeMargin={true}
                            fgColor="#10B981"
                            bgColor="#ffffff"
                        />
                    )}
                </motion.div>

                {/* URL Display */}
                <motion.div
                    className="bg-slate-50 rounded-xl p-4 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-xs text-slate-600 mb-2">Access URL:</p>
                    <p className="text-sm font-mono text-green-600 break-all">{qrUrl}</p>
                </motion.div>

                {/* Instructions */}
                {localIP === 'localhost' && (
                    <motion.div
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <p className="text-sm text-amber-800 font-semibold mb-2">📱 To Share with Others:</p>
                        <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                            <li>Find your PC's local IP (Windows: cmd → ipconfig)</li>
                            <li>Replace "localhost" with your IP (e.g., 192.168.1.100)</li>
                            <li>Share the URL or QR code</li>
                        </ol>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <motion.button
                        onClick={downloadQR}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        📥 Download QR Code
                    </motion.button>

                    <motion.button
                        onClick={copyToClipboard}
                        className={`w-full font-semibold py-3 rounded-xl transition-colors ${copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {copied ? '✓ Copied!' : '📋 Copy URL'}
                    </motion.button>

                    <motion.a
                        href="/"
                        className="block w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ← Back to Home
                    </motion.a>
                </div>

                {/* Footer */}
                <motion.p
                    className="text-center text-xs text-slate-500 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Share this QR code with friends on your WiFi network
                </motion.p>
            </motion.div>
        </div>
    )
}
