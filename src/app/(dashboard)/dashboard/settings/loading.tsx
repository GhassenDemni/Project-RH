import { Card } from '@/components/ui/card';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings Loading..." />
      <div className="grid gap-10"></div>
    </DashboardShell>
  );
}
