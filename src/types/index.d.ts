import { User } from '@prisma/client';
import type { Icon } from 'lucide-react';

import { Icons } from '@/components/icons';

type NavLink = {
  title: string;
  href: string;
  disabled?: boolean;
};

type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  options?: NavLink[];
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items?: NavLink[];
    }
);

type MainNavItem = NavLink; // Y

type Author = {
  name: string;
  url: string;
};

type Contact = {
  address: string;
  phone: string;
  email: string;
};

type ColorScheme = {
  color: string;
  media: string;
};

type Links = {
  repo: string;
  author: {
    twitter: string;
    github: string;
  };
};

type SiteConfig = {
  name: string;
  short_name: string;
  title: string;
  description: string;
  type: string;
  url: string;
  logo: string;
  generator: string;
  technologies: string[];
  locales: string[];
  locale: string;
  keywords: string[];
  creator: string;
  hosting_service: string;
  publisher: string;
  authors: Author[];
  category: string;
  categories: string[];
  themes: string[];
  color_scheme: string;
  theme_color: ColorScheme[];
  ogImage: string;
  links: Links;
  contact: Contact;
};

export type DashboardConfig = {
  navbar: MainNavItem[];
  sidebar: SidebarNavItem[];
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, 'stripeCustomerId' | 'stripeSubscriptionId'> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };
