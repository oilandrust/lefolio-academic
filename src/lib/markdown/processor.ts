import type { PluggableList } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

/** Remark/rehype plugin lists used by MarkdownRenderer. */
export const remarkPlugins: PluggableList = [remarkGfm, remarkMath];
export const rehypePlugins: PluggableList = [rehypeKatex, rehypeRaw];
