import Form from "./form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import db from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components"

export const metadata = {
  title: "Edit role",
  description: "Edit role desc...",
}

type Props = {
  params: {
    id: string
  }
}

export default async function Script({ params }: Props) {
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
      <DashboardHeader heading="Edit Role" text="Edit Roles desc">
        <Link href={`/admin/dashboard/roles`}>
          <Button variant="outline">View roles table</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-10">
        <Form defaultValues={role} />
      </div>
    </DashboardShell>
  )
}
