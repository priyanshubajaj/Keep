import type { Metadata } from 'next'
import { Fraunces, Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'Keep',
  description: 'A place to record the people who matter — in their words, in their voice.',
  other: { 'color-scheme': 'light' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
