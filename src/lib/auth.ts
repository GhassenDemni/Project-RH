import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/lib/prisma';
import { env } from '@/env.mjs';

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color value
    logo: '', // Absolute URL to logo image
  },
  // debug: env?.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize({ email, password }) {
        // const user = await login(credentials)
        return { email, password };
      },
    }),

    // EmailProvider({
    //   from: env.SMTP_FROM,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await db.user.findUnique({
    //       where: {
    //         email: identifier,
    //       },
    //       select: {
    //         emailVerified: true,
    //       },
    //     })

    //     const templateId = user?.emailVerified
    //       ? env.POSTMARK_SIGN_IN_TEMPLATE
    //       : env.POSTMARK_ACTIVATION_TEMPLATE
    //     if (!templateId) {
    //       throw new Error("Missing template id")
    //     }

    //     const result = await postmarkClient.sendEmailWithTemplate({
    //       TemplateId: parseInt(templateId),
    //       To: identifier,
    //       From: provider.from as string,
    //       TemplateModel: {
    //         action_url: url,
    //         product_name: siteConfig.name,
    //       },
    //       Headers: [
    //         {
    //           // Set this to prevent Gmail from threading emails.
    //           // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
    //           Name: "X-Entity-Ref-ID",
    //           Value: new Date().getTime() + "",
    //         },
    //       ],
    //     })

    //     if (result.ErrorCode) {
    //       throw new Error(result.Message)
    //     }
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const { id, name, email, username, avatar, Role } =
        (await prisma.user.findUnique({
          where: {
            email: (token as JWT)?.email || '',
          },
          include: { Role: true },
        })) || {};

      if (!id) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id,
        name,
        email,
        username,
        image: avatar || '',
        role: Role?.name || 'USER',
      };
    },
    async session({ token, session }) {
      if (token) {
        const sessionUser = token as SessionUser; // Explicitly cast the token to SessionUser
        session.user.id = sessionUser.id;
        session.user.name = sessionUser.name;
        session.user.username = sessionUser.username;
        session.user.email = sessionUser.email;
        session.user.image = sessionUser.image;
        session.user.role = sessionUser.role;
      }

      return session;
    },
  },
};

export default authOptions;
