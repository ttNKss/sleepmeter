import type { Metadata } from 'next'
import { M_PLUS_1 } from 'next/font/google'
import './globals.css'

const mplus = M_PLUS_1({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Sleepmeter',
  description: 'Sleepmeter'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body className={mplus.className}>{children}</body>
    </html>
  )
}
