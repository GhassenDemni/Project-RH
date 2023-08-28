import { siteConfig } from '@/config/site';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

const LINKS = ['about', 'services', 'contact'];
const link_classes = 'text-sm font-medium underline underline-offset-4';

export function SiteFooter() {
  return (
    <footer className="container">
      <div className="flex flex-col items-center justify-between gap-4 border-t py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo />
          <p className="text-center text-sm leading-loose md:text-left">
            Contact us{' '}
            <a href={`tel:${siteConfig.contact.phone}`} className={link_classes}>
              {siteConfig.contact.phone}
            </a>{' '}
            or{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className={link_classes}>
              {siteConfig.contact.email}
            </a>
            . {siteConfig.contact.address}
          </p>
        </div>
        <nav>
          <ul className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            {LINKS.map(link => {
              return (
                <li key={link}>
                  <Link className={link_classes} href={'/' + link}>
                    {link[0].toUpperCase() + link.slice(1)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="text-center text-sm md:text-left">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  );
}
