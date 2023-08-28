import { dashboardConfig } from '@/config/dashboard';
import { getCurrentUser, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Layout from '@/components/layout';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getSession();
  const user = await getCurrentUser();

  if (!user || !session) {
    // throw new AuthRequiredError()
    redirect('/login');
  }

  return (
    <Layout sidebar={dashboardConfig.navbar} navbar={dashboardConfig.sidebar}>
      {children}
    </Layout>
  );
}
