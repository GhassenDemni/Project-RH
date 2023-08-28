'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import api from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function MFAButton({ totp }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const disable2FA = async () => {
    try {
      setIsLoading(true);
      await api.post('auth/otp/disable', {
        user_id: totp.user_id,
        auth_option_id: totp.id,
      });
      toast({
        title: 'Otp disabled',
      });
      router.refresh();
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!totp) {
    return (
      <Link href="/otp/generate" onClick={() => setIsLoading(true)}>
        <Button isLoading={isLoading}>Enable 2FA</Button>
      </Link>
    );
  }

  if (totp.isEnabled) {
    return (
      <Button isLoading={isLoading} variant="destructive" onClick={disable2FA}>
        Disable 2FA
      </Button>
    );
  }
}
