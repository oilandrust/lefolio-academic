import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { loadManifest, getSectionRoutes } from '@/lib/content/load-manifest';

export function generateStaticParams() {
  return getSectionRoutes();
}

export default async function SectionIndexPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionName } = await params;
  const manifest = loadManifest();

  const standalonePage = manifest.standalonePages.find(
    (page) => page.segment === sectionName
  );
  if (standalonePage) {
    return (
      <article>
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{standalonePage.title}</h1>
        <MarkdownRenderer content={standalonePage.processedBody} />
      </article>
    );
  }

  const section = manifest.sections.find((s) => s.name === sectionName);

  if (!section) {
    return <p className="text-slate-600">Section not found.</p>;
  }

  return (
    <article>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">{section.name}</h1>
      <p className="mb-8 text-slate-600">Pages in this section.</p>
      <ul className="space-y-3">
        {section.pages.map((page) => (
          <li key={page.href}>
            <Link href={page.href} className="text-lg text-blue-600 hover:underline">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
