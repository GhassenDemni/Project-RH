import { marketingConfig } from '@/config/marketing';
import Layout from '@/components/layout';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <Layout display_footer navbar={marketingConfig.mainNav}>
      {children}
    </Layout>
  );
}
