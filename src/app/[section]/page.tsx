import MarkdownRenderer from '@/components/MarkdownRenderer';
import SectionPageList from '@/templates/academic/views/SectionPageList';
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
        <h1 className="text-heading mb-6 text-3xl font-bold">{standalonePage.title}</h1>
        <MarkdownRenderer content={standalonePage.processedBody} />
      </article>
    );
  }

  const section = manifest.sections.find((s) => s.name === sectionName);

  if (!section) {
    return <p className="text-muted">Section not found.</p>;
  }

  const title = section.index?.title || section.name;
  const showDefaultIntro = !section.index?.processedBody;

  return (
    <article>
      <h1 className="text-heading mb-2 text-3xl font-bold">{title}</h1>

      {section.index?.processedBody ? (
        <div className="mb-2">
          <MarkdownRenderer content={section.index.processedBody} />
        </div>
      ) : null}

      {showDefaultIntro ? (
        <p className="text-muted mb-8">Pages in this section.</p>
      ) : null}

      <SectionPageList
        display={section.display}
        pages={section.pages}
        highlightAuthor={manifest.config.author?.name}
      />
    </article>
  );
}
