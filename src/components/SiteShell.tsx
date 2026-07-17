'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import type { ContentManifest } from '@/lib/content/types';

interface SiteShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar
        manifest={manifest}
        mobileProfileOpen={open}
        onToggleMobileProfile={() => setOpen((v) => !v)}
      />

      <div className="lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_var(--sidebar-width)]">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] transform bg-slate-50 transition-transform lg:static lg:translate-x-0 ${
            open ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
        >
          <div className="h-14 lg:hidden" aria-hidden />
          <Sidebar manifest={manifest} />
        </div>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            aria-label="Close profile"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-w-0 px-6 py-8 lg:px-10">{children}</main>
        <div className="hidden lg:block" aria-hidden />
      </div>
    </div>
  );
}
