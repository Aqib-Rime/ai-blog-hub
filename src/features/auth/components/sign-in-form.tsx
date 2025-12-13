'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppForm } from '@/components/ui/form'
import { toast } from 'sonner'
import { revalidateLogic } from '@tanstack/react-form'

export function SignInForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      try {
        const result = await signIn.email({
          email: value.email,
          password: value.password,
        })

        if (result.error) {
          toast.error(result.error.message || 'Sign in failed')
          return
        }

        toast.success('Signed in successfully!')
        router.push('/')
        router.refresh()
      } catch (error) {
        toast.error('An unexpected error occurred')
      }
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <CardContent className="space-y-4">
          <form.AppField
            name="email"
            validators={{
              onDynamic: ({ value }) =>
                !value
                  ? 'Email is required'
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Invalid email address'
                    : undefined,
            }}
          >
            {(field) => (
              <field.TextField label="Email" placeholder="name@example.com" type="email" />
            )}
          </form.AppField>
          <form.AppField
            name="password"
            validators={{
              onDynamic: ({ value }) => (!value ? 'Password is required' : undefined),
            }}
          >
            {(field) => <field.PasswordField label="Password" placeholder="Enter your password" />}
          </form.AppField>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <form.AppForm>
            <form.SubmitButton label="Sign in" pendingLabel="Signing in..." />
          </form.AppForm>
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
