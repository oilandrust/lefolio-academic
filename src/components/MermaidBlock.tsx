'use client';

import { useEffect, useId, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidBlockProps {
  chart: string;
}

export default function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    mermaid
      .render(`mermaid-${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) el.innerHTML = svg;
      })
      .catch((err) => {
        if (!cancelled) {
          el.innerHTML = `<pre class="text-sm text-red-600">Mermaid error: ${String(err)}</pre>`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4"
      aria-label="Mermaid diagram"
    />
  );
}
