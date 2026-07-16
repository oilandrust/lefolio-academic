'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/processor';
import 'katex/dist/katex.min.css';

const MermaidBlock = dynamic(() => import('./MermaidBlock'), { ssr: false });
const PlotlyBlock = dynamic(() => import('./PlotlyBlock'), { ssr: false });

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1];
  const code = String(children).replace(/\n$/, '');

  if (lang === 'mermaid') {
    return <MermaidBlock chart={code} />;
  }

  if (lang === 'plotly') {
    return <PlotlyBlock spec={code} />;
  }

  if (className) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return <code {...props}>{children}</code>;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-academic">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
