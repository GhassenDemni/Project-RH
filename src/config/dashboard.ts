import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  navbar: [
    {
      title: 'Contact',
      href: '/contact',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Support',
      href: '/support',
      disabled: true,
    },
  ],
  sidebar: [
    {
      title: 'General',
      href: '/dashboard',
      icon: 'user',
    },
    {
      title: 'Bulletins',
      href: '/dashboard/bulletins',
      icon: 'rapport',
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: 'settings',
    },
    {
      title: 'Security',
      href: '/dashboard/security',
      icon: 'shield',
    },
  ],
};
