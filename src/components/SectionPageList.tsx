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
    <p className="mt-1 text-sm text-slate-600">
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
            {isHighlight ? <strong className="font-semibold text-slate-900">{author}</strong> : author}
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
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28">
              {page.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-blue-700 sm:text-xl">
                {page.title}
              </h2>
              <AuthorLine authors={page.authors} highlightAuthor={highlightAuthor} />
              {page.venue && (
                <p className="mt-1 text-sm italic text-slate-500">{page.venue}</p>
              )}
            </div>
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
          <Link href={page.href} className="text-lg text-blue-600 hover:underline">
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
    return <p className="mt-8 text-slate-600">No pages in this section yet.</p>;
  }

  if (display === 'publication_thumbnail' || display === 'thumbnail') {
    return <PublicationThumbnailList pages={pages} highlightAuthor={highlightAuthor} />;
  }

  return <SimpleList pages={pages} />;
}
