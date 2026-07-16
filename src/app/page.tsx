import MarkdownRenderer from '@/components/MarkdownRenderer';
import { loadManifest } from '@/lib/content/load-manifest';

export default function HomePage() {
  const manifest = loadManifest();
  const home = manifest.home;

  if (!home) {
    return (
      <article>
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Home</h1>
        <p className="text-slate-600">Configure `home` in Content/config.yaml.</p>
      </article>
    );
  }

  return (
    <article>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{home.title}</h1>
      <MarkdownRenderer content={home.processedBody} />
    </article>
  );
}
