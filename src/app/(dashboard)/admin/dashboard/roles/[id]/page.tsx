import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import db from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {Button} from "@/components"

type Props = {
  params: {
    id: string
  }
}

export default async function Role({ params }: Props) {
  const role = await db.role.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!role) {
    return notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Role details" text={`Role`} > <Link href={`/admin/dashboard/roles`}>
        <Button variant="outline">View roles table</Button>
        </Link> </DashboardHeader>
      <div className="grid gap-4">
        <ul>
          <li>
            <strong>ID: {role.id}</strong>
          </li>
          <li>
            <strong>Name: {role.name}</strong>
          </li>
          <li>
            <strong>Description: {role.description}</strong>
          </li>
          <li>
            <strong>
              Created at: {new Date(role.created_at).toLocaleDateString()}
            </strong>
          </li>
          <li>
            <strong>
            Updated at: {new Date(role.updated_at).toLocaleDateString()}
            </strong>
          </li>
            <ul>
              <a href={`/admin/dashboard/users/${role.created_by_id}`}>
                  AZAZ
              </a>
            </ul>
        </ul>
      </div>
    </DashboardShell>
  )
}
