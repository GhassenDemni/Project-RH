import { PermissionDeniedError } from '@/lib/exceptions';

export default function Home() {
  throw new PermissionDeniedError();

  return <main className="flex min-h-screen flex-col items-center justify-between p-24">Yo</main>;
}
