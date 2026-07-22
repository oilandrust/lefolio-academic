'use client';

import Navbar from './Navbar';
import type { ContentManifest } from '@/lib/content/types';

interface SiteShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  return (
    <div className="showcase-shell min-h-screen">
      <Navbar manifest={manifest} />
      <main className="showcase-main">{children}</main>
      <footer className="showcase-footer border-t">
        <div className="showcase-container flex flex-wrap items-center justify-between gap-3 py-8 text-sm">
          <p className="text-muted">{manifest.config.site.title}</p>
          <p className="text-muted">
            Engine:{' '}
            <a
              className="link-primary"
              href="https://github.com/oilandrust/lefolio-academic"
              target="_blank"
              rel="noreferrer"
            >
              lefolio-academic
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
