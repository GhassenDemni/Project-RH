'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { userRegisterSchema } from '@/lib/schema';
import { Button, Input } from '@/components';
import api from '@/lib/axios';
import Link from 'next/link';
import display_error from '@/helpers/display_error';

type FormData = z.infer<typeof userRegisterSchema>;

type Providers = 'email' | 'google' | 'passkey' | '';

interface Helper {
  [key: string]: {
    message: string;
    href?: string;
    type?: 'warn' | 'error';
    suggestions?: string[];
  };
}

const fields = [
  {
    name: 'username',
    placeholder: 'Enter your username',
    autoComplete: 'username webauthn',
    visible: false,
  },
  {
    // label: "Email",
    // required: true,
    name: 'email',
    placeholder: 'Enter your email',
    autoComplete: 'email',
    // type: "email",
  },
  {
    name: 'new_password',
    type: 'password',
    placeholder: 'Enter your password',
    autoComplete: 'new-password',
    // label: "Password",
    // required: true,
    // name: "password",
    // visible: false,
  },
];

export default function RegisterForm({ className, ...props }: any) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userRegisterSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerLoading, setProviderLoading] = useState<string>('');
  const [helper, setHelper] = useState<Helper | null>(null);
  const router = useRouter();

  const clear = () => {
    clearErrors();
    setHelper(null);
    loading(false);
    // reset()
  };

  const loading = (who?: Providers | boolean) => {
    setIsLoading(!!who);
    setProviderLoading(typeof who === 'string' ? who : '');
  };

  async function onSubmit(data: FormData) {
    try {
      loading('email');
      const {
        data: { message, result },
      } = await api.post(`/auth/register`, data);

      switch (data.type) {
        case 'passwordless':
          // navigator.credentials.store(
          //   new FederatedCredential({
          //     provider: 'https://accounts.google.com',
          //     id: result.email,
          //     name: result.name || result.username,
          //     iconUrl: '',
          //   })
          // );
          break;
        case 'password':
          break;
        default:
          break;
      }

      toast({
        title: `${message}`,
      });
      await signIn('credentials', result);
      router.push('/dashboard');
      // ask user if want to enable passkey

      clear();
      reset();
    } catch (err) {
      display_error(err, setHelper);
    } finally {
      loading(false);
    }
  }

  useEffect(() => {
    helper && setFocus(Object.keys(helper)[0] as any);

    const timeout = setTimeout(() => {
      setHelper(null);
    }, 30 * 1000);

    return () => clearTimeout(timeout);
  }, [helper, setFocus]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {fields
            .filter(f => f.visible !== false)
            .map(({ name, ...field }, index) => {
              return (
                <React.Fragment key={name}>
                  <Input
                    disabled={isLoading}
                    {...register(name as any)}
                    {...field}
                    autoFocus={index === 0}
                  />
                  {errors[name] && (
                    <p className="px-1 text-xs text-red-600">{errors[name].message}</p>
                  )}
                  {helper?.[name] && (
                    <div className="flex flex-col gap-1 px-1 text-xs">
                      {helper[name].href ? (
                        <Link href={helper[name].href} className="text-red-600 underline">
                          {helper[name].message}
                        </Link>
                      ) : (
                        <p className="text-red-600">{helper[name].message}</p>
                      )}

                      {helper[name]?.suggestions && (
                        <div className="flex">
                          <p className="mr-1">Suggestions: </p>
                          {helper[name].suggestions.map((sugg, index) => (
                            <p
                              className="cursor-pointer text-green-600 underline"
                              onClick={() => setValue(name, sugg)}
                              key={index}
                            >
                              {index > 0 && ', '}
                              {sugg}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          <Button isLoading={providerLoading === 'email'} disabled={isLoading}>
            Register with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
