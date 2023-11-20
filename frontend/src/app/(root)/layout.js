import { APIProvider } from '@/app/lib/apiContext';
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'User Networking',
  description: 'User Networking',
}

export default function RootLayout({ children }) {
  return (
    <APIProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </APIProvider>
  )
}
