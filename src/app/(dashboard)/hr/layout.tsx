import { adminDashboardConfig } from '@/config/admin';
import { getSession } from '@/lib/session';
import { PermissionDeniedError } from '@/lib/exceptions';
import Layout from '@/components/layout';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  // if (!user || user?.role !== 'HR') {
  //   throw new PermissionDeniedError('Only HR can access this page');
  // }
  return (
    <Layout sidebar={adminDashboardConfig.sidebar} navbar={adminDashboardConfig.navbar}>
      {children}
    </Layout>
  );
}
