import { join } from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: join(process.cwd(), '..'),
  },
};

export default nextConfig;
