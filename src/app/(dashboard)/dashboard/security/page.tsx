import { redirect } from 'next/navigation';
import { getCurrentUser, getSession } from '@/lib/session';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MFAButton from './components/mfa';
import { AuthOptionType, User, AuthOption } from '@prisma/client';

import Link from 'next/link';

export const metadata = {
  title: 'Security',
  description: 'Manage..',
};

type UserWithAuthOptions = User & AuthOption[];

export default async function SecurityPage() {
  const user = await getCurrentUser({
    include: {
      auth_options: true,
    },
  });

  if (!user) redirect('/login');

  const get_auth_method = (method: AuthOptionType) => {
    return user?.auth_options.find(auth_option => auth_option.type === method);
  };

  const totp = get_auth_method(AuthOptionType.TOTP);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Security"
        text="Manage your account's security settings and privacy preferences to ensure the safety of your data. Take control of your authentication, password management, and other security measures to protect your information."
      />
      <div className="grid gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication (2FA) 🔐</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1 space-y-4 pb-6 text-sm">
            <p>
              Enable two-factor authentication (2FA) to add an extra layer of security to your
              account. With 2FA, you&apos;ll need to enter a code from an authenticator app in
              addition to your password, making it much harder for anyone to gain unauthorized
              access to your account. Follow the instructions in the Security section of your
              account settings to get started.
            </p>
            <div className="flex gap-2">
              <MFAButton totp={totp} />
              {/* {totp?.preferred && <Badge>Preferred</Badge>} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
