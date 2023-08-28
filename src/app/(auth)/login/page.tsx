import { Metadata } from 'next';
import Link from 'next/link';

import { Icons } from '@/components/icons';
import LoginForm from './form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default async function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center gap-5 sm:w-[350px]">
        <div className="flex flex-col gap-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email or username to sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/password/forget" className="hover:text-brand underline underline-offset-4">
            Forget password?
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/register" className="hover:text-brand underline underline-offset-4">
            Don&lsquo;t have an account? Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

// import { Metadata } from "next"
// import Link from "next/link"

// import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
// import { buttonVariants } from "@/components/ui/button"
// import LoginForm from "./form"
// import { useTranslations } from "next-intl"

// export const metadata: Metadata = {
//   title: "Login",
//   description: "Login to your account",
// }

// export default function LoginPage() {
//   const t = useTranslations("Index.login")

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="mx-auto flex w-full flex-col justify-center gap-5 sm:w-[350px]">
//         <div className="flex flex-col gap-2 text-center">
//           <Icons.logo className="mx-auto h-6 w-6" />
//           <h1 className="text-2xl font-semibold">{t("title")}</h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400">
//             {t("subtitle")}
//           </p>
//         </div>
//         <LoginForm />
//         <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
//           <Link
//             href="/forget-password"
//             className="hover:text-brand underline underline-offset-4"
//           >
//             {t("forgetPassword")}
//           </Link>
//         </p>
//         <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
//           <Link
//             href="/register"
//             className="hover:text-brand underline underline-offset-4"
//           >
//             {t("createAccount")}
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }
