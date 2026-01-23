
import './globals.css'
import NavBar from '@/components/NavBar'
import PWARegister from '@/components/PWARegister'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SFamilyOne',
  description: 'Comparte, chatea y expresa tu mundo con SFamilyOne',
  manifest: '/manifest.json',
  icons: [{ url: '/icon-192.png' }, { url: '/icon-512.png' }]
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="es">
      <body>
        <NavBar />
        <PWARegister />
        <main className="max-w-4xl mx-auto p-4 space-y-4">{children}</main>
      </body>
    </html>
  )
}
