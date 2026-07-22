import Link from 'next/link';
import type { SectionListItem } from '@/lib/content/types';

interface SectionPageListProps {
  display: string;
  pages: SectionListItem[];
  highlightAuthor?: string;
}

function AuthorLine({
  authors,
  highlightAuthor,
}: {
  authors: string[];
  highlightAuthor?: string;
}) {
  if (authors.length === 0) return null;

  const highlight = highlightAuthor?.toLowerCase().trim();
  const highlightParts = highlight ? highlight.split(/\s+/).filter(Boolean) : [];
  const highlightLast = highlightParts[highlightParts.length - 1];

  return (
    <p className="text-muted mt-1 text-sm">
      {authors.map((author, index) => {
        const lower = author.toLowerCase();
        const isHighlight =
          !!highlight &&
          (lower === highlight ||
            lower.includes(highlight) ||
            highlight.includes(lower) ||
            (!!highlightLast && lower.includes(highlightLast)));

        return (
          <span key={`${author}-${index}`}>
            {index > 0 ? ', ' : ''}
            {isHighlight ? (
              <strong className="text-heading font-semibold">{author}</strong>
            ) : (
              author
            )}
          </span>
        );
      })}
    </p>
  );
}

function PublicationThumbnailList({
  pages,
  highlightAuthor,
}: {
  pages: SectionListItem[];
  highlightAuthor?: string;
}) {
  return (
    <ul className="mt-8 space-y-8">
      {pages.map((page) => (
        <li key={page.href}>
          <Link href={page.href} className="group flex gap-5 no-underline">
            <div className="card-surface h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
              {page.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="text-muted flex h-full w-full items-center justify-center text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-heading group-hover-primary text-lg font-semibold leading-snug sm:text-xl">
                {page.title}
              </h2>
              <AuthorLine authors={page.authors} highlightAuthor={highlightAuthor} />
              {page.venue && <p className="text-muted mt-1 text-sm italic">{page.venue}</p>}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProjectGrid({ pages }: { pages: SectionListItem[] }) {
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2">
      {pages.map((page) => (
        <li key={page.href}>
          <Link href={page.href} className="group block no-underline">
            <div className="card-surface aspect-[16/10] overflow-hidden rounded-lg">
              {page.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="text-muted flex h-full w-full items-center justify-center text-sm">
                  No image
                </div>
              )}
            </div>
            <h2 className="text-heading group-hover-primary mt-3 text-lg font-semibold leading-snug">
              {page.title}
            </h2>
            {page.subtitle ? <p className="text-muted mt-1 text-sm">{page.subtitle}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SimpleList({ pages }: { pages: SectionListItem[] }) {
  return (
    <ul className="mt-8 space-y-3">
      {pages.map((page) => (
        <li key={page.href}>
          <Link href={page.href} className="link-primary text-lg hover:underline">
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SectionPageList({
  display,
  pages,
  highlightAuthor,
}: SectionPageListProps) {
  if (pages.length === 0) {
    return <p className="text-muted mt-8">No pages in this section yet.</p>;
  }

  if (display === 'grid') {
    return <ProjectGrid pages={pages} />;
  }

  if (display === 'publication_thumbnail' || display === 'thumbnail') {
    return <PublicationThumbnailList pages={pages} highlightAuthor={highlightAuthor} />;
  }

  return <SimpleList pages={pages} />;
}
