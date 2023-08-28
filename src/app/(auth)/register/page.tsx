import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import RegisterForm from "./form"
import Background from "./background"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Background />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold">Create an account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your email & password below to create your account
            </p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              You have an account? Login
            </Link>
          </p>
          <p className="px-8 text-center text-xs text-slate-500 dark:text-slate-400">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
