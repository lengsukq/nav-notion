import type { Metadata } from 'next'
import { Providers } from '@/app/providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nav Notion',
  description: 'Navigation management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <ThemeProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}