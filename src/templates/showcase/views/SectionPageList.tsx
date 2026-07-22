import Link from 'next/link';
import type { SectionListItem } from '@/lib/content/types';

interface SectionPageListProps {
  pages: SectionListItem[];
  display?: string;
}

export default function SectionPageList({ pages }: SectionPageListProps) {
  if (pages.length === 0) {
    return <p className="text-muted">No pages in this section yet.</p>;
  }

  return (
    <ul className="showcase-doc-list divide-y">
      {pages.map((page) => (
        <li key={page.href} className="py-5">
          <Link href={page.href} className="group block no-underline">
            <h2 className="text-heading text-xl font-semibold group-hover:underline">
              {page.title}
            </h2>
            {page.subtitle ? <p className="text-muted mt-1">{page.subtitle}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
