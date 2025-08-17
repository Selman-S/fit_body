import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fit Body - Kişisel Fitness Takip Uygulaması',
  description: 'Fitness yolculuğunuzu takip edin, ilerlemenizi görün ve hedeflerinize ulaşın. Tamamen ücretsiz ve çevrimdışı!',
  keywords: 'fitness, workout, exercise, progress tracking, health, wellness',
  authors: [{ name: 'Fit Body Team' }],
  creator: 'Fit Body Team',
  publisher: 'Fit Body',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://fitbody.app',
    title: 'Fit Body - Kişisel Fitness Takip Uygulaması',
    description: 'Fitness yolculuğunuzu takip edin, ilerlemenizi görün ve hedeflerinize ulaşın.',
    siteName: 'Fit Body',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Fit Body App Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fit Body - Kişisel Fitness Takip Uygulaması',
    description: 'Fitness yolculuğunuzu takip edin, ilerlemenizi görün ve hedeflerinize ulaşın.',
    images: ['/icons/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  category: 'Health & Fitness',
  classification: 'Fitness Application',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: 'https://fitbody.app',
    languages: {
      'tr-TR': 'https://fitbody.app/tr',
      'en-US': 'https://fitbody.app/en',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'light dark',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fit Body" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Fit Body" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Accessibility Meta Tags */}
        <meta name="accessibility-control" content="full" />
        <meta name="accessibility-feature" content="high-contrast, large-text, reduced-motion" />
        <meta name="accessibility-standard" content="WCAG 2.1 AA" />
        
        {/* Performance Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Security Meta Tags */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* SEO Meta Tags */}
        <meta name="author" content="Fit Body Team" />
        <meta name="copyright" content="Fit Body Team" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              "name": "Fit Body",
              "description": "Kişisel Fitness Takip Uygulaması",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY"
              },
              "author": {
                "@type": "Organization",
                "name": "Fit Body Team"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Ana içeriğe geç
        </a>
        
        <Providers>
          <main id="main-content" role="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
