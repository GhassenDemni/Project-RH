'use client';
import { useState, useEffect, useRef } from 'react';
import { useToast, toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { userLoginSchema } from '@/lib/schema';
import { Input, OTPInput, Button } from '@/components';
import api from '@/lib/axios';
import helper_manager from '@/helpers/helperSetter';
import { ErrorCode } from '@/types/enums';

type UserLoginSchema = z.infer<typeof userLoginSchema>;
type Providers = 'email' | 'google' | 'passkey' | '';

const fields = [
  {
    name: 'username',
    placeholder: 'Enter your username or email or number',
    autoComplete: 'username webauthn',
    autoFocus: true,
  },
  {
    name: 'password',
    placeholder: 'Enter your password',
    type: 'password',
    autoComplete: 'current-password webauthn',
    // visible: false,
  },
];

export default function LoginForm({ className, ...props }: any) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    getValues,
    reset,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
  });
  const otpInputRef: any = useRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userHasOtpEnabled, setUserHasOtpEnabled] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState('');
  const [helper, setHelper] = useState(null);
  const [providerLoading, setProviderLoading] = useState<string>('');
  const [toManyRequests, setToManyRequests] = useState<boolean>(false);
  const otpFocus = (index?: number) => otpInputRef?.current?.focusToInput(index) as any;

  const loading = (who: Providers = '') => {
    setIsLoading(who ? true : false);
    setProviderLoading(who);
  };

  async function onSubmit(data: any) {
    if (userHasOtpEnabled) {
      data.otp = otpCode;
      if (!otpCode.trim() || otpCode.trim().length !== 6) {
        toast({
          title: 'OTP field is required and must be 6 digits',
          variant: 'destructive',
        });
        otpFocus();
        return;
      }
    }
    try {
      loading('email');
      const {
        data: { message, result },
      } = await api.post(`/auth/login`, data);
      toast({ title: message });
      await signIn('credentials', result);
    } catch (err: any) {
      const { message, helper, error } = err.response?.data;
      switch (error?.code) {
        case ErrorCode.InvalidOTP:
          setOtpCode('');
          otpFocus();
          break;
        case ErrorCode.NeedOtp:
          setUserHasOtpEnabled(true);
          toast({
            title: message,
            description:
              'Please open your authenticator app and enter OTP code to access your account',
          });
          return;
        case ErrorCode.WrongPassword:
          resetField('password');
          break;
        case ErrorCode.ToManyRequests:
          // setOtpCode("000000")
          setToManyRequests(true);
          break;
      }

      if (helper) {
        helper_manager(helper, setHelper, setFocus);
      }

      toast({
        title: message,
        variant: 'destructive',
      });
    } finally {
      loading();
      setFocus('password');
    }
  }

  useEffect(() => {
    // helper && setFocus(Object.keys(helper)[0]);

    const timeout = setTimeout(() => {
      setHelper(null);
    }, 30 * 1000);

    return () => clearTimeout(timeout);
  }, [helper, setFocus]);

  const OtpSection = () => {
    return (
      <section className="grid gap-2">
        <p className="center text-sm text-slate-500 dark:text-slate-400">
          Please enter the verification code from the authentication app into the OTP input field
          below.
        </p>
        <OTPInput
          disabled={toManyRequests}
          value={otpCode}
          ref={otpInputRef}
          onChange={value => setOtpCode(value)}
        />
      </section>
    );
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {toManyRequests && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">Too many requests.</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {userHasOtpEnabled ? (
            <OtpSection />
          ) : (
            fields.map((field, index) => (
              <Input
                key={field.name}
                {...register(field.name)} // Corrected line
                helper={helper}
                errors={errors}
                disabled={toManyRequests}
                {...props}
              />
            ))
          )}
          <Button isLoading={providerLoading === 'email'} disabled={isLoading || toManyRequests}>
            {userHasOtpEnabled ? 'Verify OTP and Login' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}
