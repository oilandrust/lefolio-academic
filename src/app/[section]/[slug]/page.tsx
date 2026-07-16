import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getAllPageParams, getPage } from '@/lib/content/load-manifest';

export function generateStaticParams() {
  return getAllPageParams();
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const page = getPage(section, slug);

  if (!page) {
    return <p className="text-slate-600">Page not found.</p>;
  }

  return (
    <article>
      <p className="mb-2 text-sm uppercase tracking-wide text-slate-400">{page.section}</p>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
