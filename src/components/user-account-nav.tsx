'use client';
import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import { UserAvatar } from '@/components/user-avatar';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: any;
}

type Props = {
  user: UserAccountNavProps;
  menuItems: any;
};

const Render = ({ href, children }: any) => {
  if (href) {
    return <Link href={href}>{children}</Link>;
  } else {
    return children;
  }
};

export function UserAccountNav({ user, menuItems }: Props) {
  if (!user) return <div>NO USER</div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={{ name: user.name, image: user.image }} className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.username && <p className="font-medium">@{user.username}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            )}
            <p className="w-[200px] truncate text-sm text-slate-600">
              {user.role === 'ADMIN' ? (
                <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                  Admin
                </span>
              ) : (
                <span className="rounded-md bg-gray-500 px-2 py-1 text-xs font-bold text-white">
                  {user.role}
                </span>
              )}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {menuItems?.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {group.items.map((item, itemIndex) => {
                return (
                  <React.Fragment key={itemIndex}>
                    {item.subItems ? (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          {item.icon}
                          <span>{item.text}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {item.subItems.map((subItem, subItemIndex) => (
                              <Render href={subItem.href} key={subItem.href}>
                                <DropdownMenuItem key={subItemIndex} disabled={subItem.disabled}>
                                  {subItem.icon}
                                  <span>{subItem.text}</span>
                                </DropdownMenuItem>
                              </Render>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ) : (
                      <Render href={item.href}>
                        <DropdownMenuItem disabled={item.disabled}>
                          {item.icon}
                          <span>{item.text}</span>
                          {item.shortcut && (
                            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                          )}
                        </DropdownMenuItem>
                      </Render>
                    )}
                  </React.Fragment>
                );
              })}
            </DropdownMenuGroup>
            {groupIndex < menuItems.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={event => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
