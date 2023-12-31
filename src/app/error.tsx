'use client';
import Link from 'next/link';
import { AiOutlineRedo } from 'react-icons/ai';
import { Button } from '@/components';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const errorType = error?.stack?.split(':')[0];
  const type = () => {
    switch (errorType) {
      case 'AuthRequiredError':
        return 'warn';
      case 'PermissionDeniedError':
        return 'danger';
      case 'BadRequestError':
        return 'warn';
      default:
        return 'danger';
    }
  };

  return (
    <main className={`error-page gradient-bg-anim bg bg-${type()}`}>
      <span className={`badge ${type()}`}>{errorType || error.name}</span>
      <h1 className="title">{error.message}</h1>
      <p className="desc">
        An error occurred: Please try again later or contact support if the problem persists.
      </p>
      <div className="btn-group">
        <Button color={type()} size="lg" variant="outline" onClick={reset}>
          <AiOutlineRedo />
          <span>Try again</span>
        </Button>
        <Link href="/">
          {/* @ts-ignore */}
          <Button size="lg" className={type()} color={type()}>
            Take me home
          </Button>
        </Link>
      </div>
    </main>
  );
}
