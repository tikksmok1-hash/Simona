const BASE_URL = process.env.NEXTAUTH_URL || 'https://simona.md';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cos', '/comanda', '/favorite'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
