import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, 'Content', 'config.yaml');

function readBasePath() {
  try {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    return (config.site?.basePath || '').replace(/\/$/, '');
  } catch {
    return '';
  }
}

const basePath = readBasePath();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
