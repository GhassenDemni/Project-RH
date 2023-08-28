"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import api, { make } from "@/lib/axios"
import toast from "react-hot-toast"
import { Router, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Role Management Actions */}
        <Link href={`/admin/dashboard/roles/${row.original.id}`}>
          <DropdownMenuItem>View Role Details</DropdownMenuItem>
        </Link>
        <Link href={`/admin/dashboard/users/${row.original.created_by_id}`}>
          <DropdownMenuItem>View Role Creator</DropdownMenuItem>
        </Link>
        <Link href={`/admin/dashboard/roles/edit/${row.original.id}`}>
          <DropdownMenuItem>Edit Role</DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Assign role to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {row.original.users.map(
                (user: { email: string; id: string; role_id?: string }) => {
                  if (user.role_id === row.original.id) {
                    return null
                  }
                  return (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={async () => {
                        await make({
                          method: "PUT",
                          url: `/role/assign`,
                          data: {
                            role_id: row.original.id,
                            user_id: user.id,
                          },
                        })
                        router.refresh()
                      }}
                    >
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                  )
                }
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>Assign Permissions</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const confirm = window.confirm(
              "Are you sure you want to delete this role"
            )
            if (confirm) {
              await make({
                method: "DELETE",
                url: `/role/${row.original.id}`,
              })
              router.refresh()
            } else {
              return toast("Cancel")
            }
          }}
        >
          Delete Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
