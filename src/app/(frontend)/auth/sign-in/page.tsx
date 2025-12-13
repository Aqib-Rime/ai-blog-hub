import { SignInForm } from '@/features/auth/components/sign-in-form'

export const metadata = {
  title: 'Sign In - AI Blog Hub',
  description: 'Sign in to your AI Blog Hub account',
}

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignInForm />
    </main>
  )
}
