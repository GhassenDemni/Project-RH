import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().nonempty(),
    MAIL_SERVER: z.string().nonempty(),
    DATABASE_URL: z.string().nonempty(),
    SMTP_FROM: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().nonempty(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MAIL_SERVER: process.env.MAIL_SERVER,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_FROM: process.env.SMTP_FROM,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
