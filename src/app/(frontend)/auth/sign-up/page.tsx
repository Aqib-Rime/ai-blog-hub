import { SignUpForm } from '@/features/auth/components/sign-up-form'

export const metadata = {
  title: 'Sign Up - AI Blog Hub',
  description: 'Create your AI Blog Hub account',
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignUpForm />
    </main>
  )
}
