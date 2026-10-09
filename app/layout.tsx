import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProductScope AI — Digital Product & SaaS Opportunity Dashboard',
  description: 'Discover profitable digital product opportunities, evaluate objective scores, research competitors, and generate growth channels and platform content.',
  openGraph: {
    title: 'ProductScope AI — Digital Product & SaaS Opportunity Dashboard',
    description: 'Discover profitable digital product opportunities, evaluate objective scores, research competitors, and generate growth channels and platform content.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProductScope AI — Digital Product & SaaS Opportunity Dashboard',
    description: 'Discover profitable digital product opportunities, evaluate objective scores, research competitors, and generate growth channels and platform content.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#0B0D10] text-[#F8FAFC] min-h-screen antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

