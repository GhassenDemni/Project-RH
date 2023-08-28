"use client"
import React from "react"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { Sidebar } from "flowbite-react"

const sidebarData = [
  { title: "Home", href: "/", icon: Icons.home },
  {
    title: "Roles",
    icon: Icons.shield,
    options: [
      { title: "Create", href: "/admin/dashboard/roles/create" },
      { title: "View all", href: "/admin/dashboard/roles" },
    ],
  },
  {
    title: "Users",
    icon: Icons.user,
    options: [
      { title: "Create", href: "/admin/dashboard/users/create" },
      { title: "View all", href: "/admin/dashboard/users" },
    ],
  },
  {
    title: "Department",
    icon: Icons.dashboard,
    href: "/admin/dashboard/department/create",
  },
  {
    title: "Calendar",
    icon: Icons.calendar,
    href: "/dashboard/calendar",
  },
]

export default function DefaultSidebar() {
  return (
    <Sidebar id="SIDEBAR">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {sidebarData.map((item, index) => (
            <div key={index}>
              {item.options ? (
                <Sidebar.Collapse icon={item.icon} label={item.title}>
                  {item.options.map((option, optIndex) => (
                    <Sidebar.Item key={optIndex}>
                      <Link href={`${option.href}`}>
                        <span className="ml-3 text-sm">{option.title}</span>
                      </Link>
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Link
                  href={`${item.href}`}
                  className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <item.icon className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3 text-sm">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
