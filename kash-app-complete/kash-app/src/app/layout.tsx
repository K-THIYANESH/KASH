import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'KA-SH — Collaborative Productivity',
  description: 'Kavibala × Thiyanesh — Study, track, grow together.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'KA-SH' },
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 2500, style: { background: '#1e1e2e', color: '#e8e8f0', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, borderRadius: 12 } }} />
        </Providers>
      </body>
    </html>
  )
}
