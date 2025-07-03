import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Cosmic Classroom - Space Education Platform',
  description: 'Comprehensive space education platform with AI assistance and real-time NASA data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#121416] text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}