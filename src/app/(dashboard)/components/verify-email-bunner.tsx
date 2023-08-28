'use client';
import React from 'react';
import { openEmail } from '@/helpers';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { AiFillAlert, AiFillCheckCircle, AiOutlineClose } from 'react-icons/ai';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import api from '@/lib/axios';
import { ToastAction } from '@/components/ui/toast';

export default function VerifyEmailBunner({ email }: { email: string }) {
  const {
    mutate: sendEmailVerification,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: () => api.post('/auth/verification/email/send', { email }),
  });

  if (isSuccess) {
    const { message, result } = data.data;
    const expiresDate = new Date(result.expires);
    const currentDate = new Date();
    const timeDifference = expiresDate.getTime() - currentDate.getTime();
    const secondsInMinute = 60;
    const millisecondsInSecond = 1000;
    const m = Math.round(timeDifference / (millisecondsInSecond * secondsInMinute));
    const expiresTime = new Intl.RelativeTimeFormat(undefined, {
      style: 'long',
    }).format(m, 'minute');

    toast({
      title: message,
      description: 'Email Verification Sent. Please open your email',
      action: (
        <ToastAction altText="Open email in browser" onClick={() => openEmail(email)}>
          Open email
        </ToastAction>
      ),
    });

    return (
      <div
        className="align-center my-4 flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-800 dark:text-green-300"
        role="alert"
      >
        <span className="sr-only">Verification</span>
        {isLoading ? <FiLoader /> : <AiFillCheckCircle />}
        <div>
          <strong>Email verification sent successfully! </strong>Your verification{' '}
          <strong
            title="Open link email verification"
            onClick={() => openEmail(email)}
            className="cursor-pointer underline"
          >
            Link
          </strong>{' '}
          has been sent successfully. The link will expires <strong>{expiresTime}</strong> . Email
          not sent?{' '}
          <strong onClick={sendEmailVerification} className="cursor-pointer underline">
            Resend{' '}
          </strong>
        </div>
      </div>
    );
  }

  if (isError) {
    const error_message = error?.response?.data.message as any;
    toast({
      title: 'Failed to send email',
      description: error_message,
      variant: 'destructive',
      action: (
        <ToastAction altText="Resend" onClick={sendEmailVerification}>
          Resend
        </ToastAction>
      ),
    });

    return (
      <div
        className="align-center my-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-300"
        role="alert"
      >
        <span className="sr-only">Verification</span>
        {isLoading ? <FiLoader /> : <AiFillAlert />}
        <div className="grow">
          <strong>Failed to send email!</strong> {error_message}.{' '}
          <strong onClick={sendEmailVerification} className="cursor-pointer underline">
            Resend{' '}
          </strong>
        </div>
        {<AiOutlineClose size="15px" className="cursor-pointer" onClick={reset} />}
      </div>
    );
  }

  return (
    <div
      className="align-center my-4 flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
      role="alert"
    >
      <span className="sr-only">Verification</span>
      {isLoading ? <FiLoader /> : <FiAlertCircle />}
      {isLoading ? (
        <div>
          <strong>Sending email... </strong>Please wait while we send the email.
        </div>
      ) : (
        <div>
          <strong>Email Verification Required!</strong> Your email address has not been verified.
          Please{' '}
          <strong onClick={sendEmailVerification} className="cursor-pointer underline">
            click here{' '}
          </strong>
          to verify your email and access all features.
        </div>
      )}
    </div>
  );
}
