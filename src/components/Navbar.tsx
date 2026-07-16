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
}

export default function Navbar({ manifest }: NavbarProps) {
  const pathname = usePathname();
  const { sections, basePath } = manifest;
  const homeHref = `${basePath}/` || '/';

  const navItems = [
    { label: 'Home', href: homeHref },
    ...sections.map((section) => ({
      label: section.name,
      href: `${basePath}/${encodeURIComponent(section.name)}/`,
    })),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="flex items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6" aria-label="Main">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'nav-link nav-link-active' : 'nav-link'}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
