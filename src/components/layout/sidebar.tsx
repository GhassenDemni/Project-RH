'use client';
import Link from 'next/link';
import { Sidebar } from 'flowbite-react';
import { Icons } from '@/components/icons';
import { useSelectedLayoutSegments } from 'next/navigation';

export default function DefaultSidebar({ items }) {
  const segments = useSelectedLayoutSegments();

  function isActiveLink(href) {
    const sg = segments.slice(1).at(0);
    const h = href
      .split('/')
      .filter(x => x.trim() !== '')
      .slice(2)
      .at(0);

    return sg === h;
  }

  const Component = ({ href, title, icon, isActive }) => {
    const Icon = Icons[icon || 'arrowRight'];

    return (
      <Link
        href={href}
        style={{
          background: isActive,
        }}
        className={`flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
      >
        {icon && <Icon className="mr-2 h-4 w-4" />}
        <span className="ml-1 text-sm">{title}</span>
      </Link>
    );
  };

  return (
    <Sidebar id="SIDEBAR">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {items.map((item, index) => {
            const isActive = isActiveLink(item?.href || item?.options[0].href)
              ? 'rgb(200 , 200 , 255 , 0.2)'
              : undefined;

            return (
              <div key={index}>
                {item.options ? (
                  <Sidebar.Collapse
                    icon={Icons[item.icon]}
                    label={item.title}
                    style={{
                      background: isActive,
                    }}
                  >
                    {item.options.map((option, optIndex) => (
                      <Sidebar.Item key={optIndex}>
                        <Component {...option} />
                      </Sidebar.Item>
                    ))}
                  </Sidebar.Collapse>
                ) : (
                  <Component {...item} isActive={isActive} />
                )}
              </div>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
