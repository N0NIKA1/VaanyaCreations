import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Vaanya Creation 5 — Deity Dresses & Handmade Antiques',
  description: 'Handcrafted Poshak (Vastra) for Laddu Gopal, Radha Krishna, Mata Rani and more. Premium brass idols, puja items and antiques. Ships PAN India and internationally.',
  keywords: 'laddu gopal poshak, deity dress, radha krishna vastra, mata rani chunri, brass idol, puja items, handmade antiques, vanya handicrafts',
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
