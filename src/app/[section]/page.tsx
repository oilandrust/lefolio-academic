import MarkdownRenderer from '@/components/MarkdownRenderer';
import SectionPageList from '@/components/SectionPageList';
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

  const title = section.index?.title || section.name;
  const showDefaultIntro = !section.index?.processedBody;

  return (
    <article>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">{title}</h1>

      {section.index?.processedBody ? (
        <div className="mb-2">
          <MarkdownRenderer content={section.index.processedBody} />
        </div>
      ) : null}

      {showDefaultIntro ? (
        <p className="mb-8 text-slate-600">Pages in this section.</p>
      ) : null}

      <SectionPageList
        display={section.display}
        pages={section.pages}
        highlightAuthor={manifest.config.author?.name}
      />
    </article>
  );
}
