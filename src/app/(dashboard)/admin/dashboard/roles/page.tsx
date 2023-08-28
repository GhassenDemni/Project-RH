import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import db from "@/lib/prisma"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components"
import Link from "next/link"

export const metadata = {
  title: "Roles",
  description: "Manage roles",
}

export default async function RolePage() {
  const list = await db.role.findMany({
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  })

  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      role_id: true,
    },
  })

  const data = list.map((role) => {
    return { ...role, users }
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Roles table" text="Roles desc">
        {" "}
        <Link href="/admin/dashboard/roles/create">
          <Button>Add new role</Button>
        </Link>{" "}
      </DashboardHeader>
      <div className="grid gap-10">
        <DataTable columns={columns} data={data} />
      </div>
    </DashboardShell>
  )
}
