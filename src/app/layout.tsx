import type { Metadata } from 'next';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import { loadManifest } from '@/lib/content/load-manifest';
import { CONTENT_VERSION } from '@/lib/content/content-version';

export function generateMetadata(): Metadata {
  const manifest = loadManifest();
  return {
    title: manifest.config.site.title,
    description: manifest.config.site.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const manifest = loadManifest();
  void CONTENT_VERSION;

  return (
    <html lang="en">
      <body>
        <SiteShell manifest={manifest}>{children}</SiteShell>
      </body>
    </html>
  );
}
