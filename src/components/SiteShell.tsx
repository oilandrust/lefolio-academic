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
    <div className="min-h-screen lg:grid lg:grid-cols-[var(--sidebar-width)_1fr]">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-semibold text-slate-900">{manifest.config.author.name}</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-slate-200 px-3 py-1 text-sm"
          aria-expanded={open}
        >
          {open ? 'Close' : 'Profile'}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] transform bg-slate-50 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
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

      <div className="flex min-w-0 flex-col">
        <Navbar manifest={manifest} />
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
