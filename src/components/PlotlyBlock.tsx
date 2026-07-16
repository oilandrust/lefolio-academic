'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PlotlyBlockProps {
  spec: string;
}

export default function PlotlyBlock({ spec }: PlotlyBlockProps) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(spec) as { data?: unknown; layout?: unknown; config?: unknown };
    } catch {
      return null;
    }
  }, [spec]);

  if (!parsed?.data) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Invalid Plotly JSON block
      </pre>
    );
  }

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
      <Plot
        data={parsed.data as object[]}
        layout={{
          autosize: true,
          margin: { l: 40, r: 20, t: 40, b: 40 },
          ...(parsed.layout as object),
        }}
        config={{ responsive: true, displayModeBar: false, ...(parsed.config as object) }}
        useResizeHandler
        style={{ width: '100%', minHeight: 320 }}
      />
    </div>
  );
}
