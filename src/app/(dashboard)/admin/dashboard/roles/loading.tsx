import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Card } from "@/components/ui/card"

export default function DashboardBillingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Roles page loading..." />
      <div className="grid gap-10"></div>
    </DashboardShell>
  )
}
