import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StainViz Comparison',
    short_name: 'StainViz',
    description: 'Explore and compare virtual staining datasets, even while offline.',
    start_url: '/compare',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
