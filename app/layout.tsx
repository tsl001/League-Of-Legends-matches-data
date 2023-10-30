import './globals.css'
import type { Metadata } from 'next'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'U.GG copy',
  description: 'Copy of U.GG',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <CssBaseline />
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
        <nav>
          <ul className="flex justify-center gap-10">
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              <Link href="/items">
                 Items
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  )
}
