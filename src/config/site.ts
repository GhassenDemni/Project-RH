import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'point',
  short_name: 'point',
  title: 'A starter template',
  generator: 'Nextjs',
  description:
    'Experience the power of Next.js 13 and Typescript with our advanced starter template. Build large-scale applications easily with support for MDX, theming, and an authentication system, while ensuring 100% SEO and accessibility. Get a head start on your project today!',
  type: 'site',
  url: '',
  logo: '/brand.svg',
  technologies: ['Nextjs', 'Typescript', 'Zod', 'Sass', 'Tailwindcss', 'Framer motion'],
  locales: ['en'],
  locale: 'en-US',
  keywords: ['Starter template'],
  creator: '@x',
  hosting_service: 'Vercel',
  publisher: '@x',
  authors: [{ name: 'X', url: 'https://github.com/x' }],
  category: 'cyber security',
  categories: ['cyber security', 'network security'],
  themes: ['light', 'dark'],
  color_scheme: 'light dark',
  theme_color: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
  ogImage: 'https://tx.aminbenz.com/og.jpg',
  links: {
    repo: 'https://github.com/x/x',
    author: {
      twitter: 'https://twitter.com/x',
      github: 'https://github.com/x/',
    },
  },
  contact: {
    address: 'Main street 123',
    phone: '54000111',
    email: 'example@domin.com',
  },
};

export default siteConfig;
