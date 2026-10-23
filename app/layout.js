import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Vaanya Creation 5 — Deity Dresses & Handmade Antiques',
  description: 'Handcrafted Poshak (Vastra) for Laddu Gopal, Radha Krishna, Mata Rani and more. Premium brass idols, puja items and antiques. Ships PAN India and internationally.',
  keywords: 'laddu gopal poshak, deity dress, radha krishna vastra, mata rani chunri, brass idol, puja items, handmade antiques, vaanya creations',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }],
    shortcut: ['/icon.png'],
  },
  openGraph: {
    title: 'Vaanya Creation 5 — Deity Dresses & Handmade Antiques',
    description: 'Handcrafted Poshak, Shringar and heirloom brass pieces for devotees worldwide.',
    siteName: 'Vaanya Creation 5',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Vaanya Creations 5' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaanya Creation 5 — Deity Dresses & Handmade Antiques',
    description: 'Handcrafted Poshak, Shringar and heirloom brass pieces for devotees worldwide.',
    images: ['/opengraph-image.png'],
  },
}

export const viewport = {
  themeColor: '#7A0C2E',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
