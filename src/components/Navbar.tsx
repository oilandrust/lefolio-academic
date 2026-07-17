'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ContentManifest } from '@/lib/content/types';

function isActive(pathname: string, href: string) {
  const normalized = href.replace(/\/$/, '') || '/';
  const current = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return current === '/';
  return current === normalized || current.startsWith(`${normalized}/`);
}

interface NavbarProps {
  manifest: ContentManifest;
  mobileProfileOpen?: boolean;
  onToggleMobileProfile?: () => void;
}

export default function Navbar({
  manifest,
  mobileProfileOpen = false,
  onToggleMobileProfile,
}: NavbarProps) {
  const pathname = usePathname();
  const homeHref = '/';
  const siteTitle = manifest.config.site.title;
  const homeActive = isActive(pathname, homeHref);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_var(--sidebar-width)]">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:justify-center lg:border-r lg:border-slate-200 lg:px-4">
          <Link
            href={homeHref}
            className={homeActive ? 'site-title site-title-active' : 'site-title'}
          >
            {siteTitle}
          </Link>

          {onToggleMobileProfile && (
            <button
              type="button"
              onClick={onToggleMobileProfile}
              className="shrink-0 rounded-md border border-slate-200 px-3 py-1 text-sm lg:hidden"
              aria-expanded={mobileProfileOpen}
            >
              {mobileProfileOpen ? 'Close' : 'Profile'}
            </button>
          )}
        </div>

        <nav
          className="flex items-center gap-5 overflow-x-auto border-t border-slate-100 px-4 sm:px-6 lg:border-t-0 lg:px-10"
          aria-label="Main"
        >
          {manifest.navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={active ? 'nav-link nav-link-active' : 'nav-link'}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:block" aria-hidden />
      </div>
    </header>
  );
}
