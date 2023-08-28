import { DashboardConfig } from 'types';

export const adminDashboardConfig: DashboardConfig = {
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
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'Roles',
      icon: 'shield',
      options: [
        { title: 'Create', href: '/admin/dashboard/roles/create' },
        { title: 'View all', href: '/admin/dashboard/roles' },
      ],
    },
    {
      title: 'Users',
      icon: 'user',
      options: [
        { title: 'Create', href: '/admin/dashboard/users/create' },
        { title: 'View all', href: '/admin/dashboard/users' },
      ],
    },
    {
      title: 'Employees',
      icon: 'user',
      options: [
        { title: 'Create', href: '/admin/dashboard/employees/create' },
        { title: 'View all', href: '/admin/dashboard/employees' },
      ],
    },
    {
      title: 'Department',
      icon: 'bulding',
      href: '/admin/dashboard/departments/create',
    },
  ],
};
