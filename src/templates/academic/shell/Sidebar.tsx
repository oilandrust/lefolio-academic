'use client';

import Link from 'next/link';
import type { ContentManifest } from '@/lib/content/types';

const LINK_LABELS: Record<string, string> = {
  email: 'Email',
  orcid: 'ORCID',
  googlescholar: 'Google Scholar',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  scholar: 'Google Scholar',
};

function formatLink(key: string, value: string) {
  if (key === 'email') return { href: `mailto:${value}`, label: LINK_LABELS.email };
  return { href: value, label: LINK_LABELS[key] || key };
}

interface SidebarProps {
  manifest: ContentManifest;
}

export default function Sidebar({ manifest }: SidebarProps) {
  const { config, authorAvatar } = manifest;
  const homeHref = '/';
  const { author, site } = config;

  return (
    <aside className="shell-sidebar flex h-full flex-col gap-6 border-r p-6">
      <div className="text-center">
        <Link href={homeHref}>
          {authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={authorAvatar}
              alt={author.name}
              className="mx-auto mb-4 h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="card-surface text-muted mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-full text-3xl font-semibold">
              {author.name.charAt(0)}
            </div>
          )}
        </Link>
        <p className="text-heading text-xl font-semibold">
          <Link href={homeHref} className="hover-primary no-underline">
            {author.name}
          </Link>
        </p>
        {author.pronouns && <p className="text-muted text-sm">{author.pronouns}</p>}
      </div>

      {author.bio && <p className="text-muted text-sm leading-relaxed">{author.bio}</p>}

      <div className="text-muted space-y-1 text-sm">
        {author.location && <p>{author.location}</p>}
        {author.employer && <p>{author.employer}</p>}
      </div>

      {author.links && Object.keys(author.links).length > 0 && (
        <ul className="space-y-1 text-sm">
          {Object.entries(author.links).map(([key, value]) => {
            const { href, label } = formatLink(key, value);
            return (
              <li key={key}>
                <a
                  href={href}
                  className="link-primary hover:underline"
                  target={key === 'email' ? undefined : '_blank'}
                  rel={key === 'email' ? undefined : 'noreferrer'}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-muted mt-auto text-xs">{site.title}</p>
    </aside>
  );
}
