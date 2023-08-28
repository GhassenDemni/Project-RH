import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Security Loading..."></DashboardHeader>
      <div className="divide-y divide-neutral-200 rounded-md border"></div>
    </DashboardShell>
  );
}
