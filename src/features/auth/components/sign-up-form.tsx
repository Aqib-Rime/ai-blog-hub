'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth-client'
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
import posthog from 'posthog-js'

export function SignUpForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      try {
        const result = await signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
        })

        if (result.error) {
          // PostHog: Track sign up failure
          posthog.capture('sign_up_failed', {
            error_message: result.error.message || 'Sign up failed',
            email: value.email,
          })
          toast.error(result.error.message || 'Sign up failed')
          return
        }

        // PostHog: Identify user and track successful sign up
        posthog.identify(value.email, {
          email: value.email,
          name: value.name,
        })
        posthog.capture('user_signed_up', {
          email: value.email,
          name: value.name,
        })

        toast.success('Account created successfully!')
        router.push('/')
        router.refresh()
      } catch (error) {
        // PostHog: Track unexpected sign up error
        posthog.capture('sign_up_failed', {
          error_message: 'An unexpected error occurred',
          email: value.email,
        })
        posthog.captureException(error)
        toast.error('An unexpected error occurred')
      }
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your details to create your account</CardDescription>
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
            name="name"
            validators={{
              onDynamic: ({ value }) => (!value ? 'Name is required' : undefined),
            }}
          >
            {(field) => <field.TextField label="Name" placeholder="John Doe" />}
          </form.AppField>
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
              onDynamic: ({ value }) =>
                !value
                  ? 'Password is required'
                  : value.length < 8
                    ? 'Password must be at least 8 characters'
                    : undefined,
            }}
          >
            {(field) => <field.PasswordField label="Password" placeholder="Create a password" />}
          </form.AppField>
          <form.AppField
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['password'],
              onDynamic: ({ value, fieldApi }) => {
                if (!value) return 'Please confirm your password'
                const password = fieldApi.form.getFieldValue('password')
                if (value !== password) return 'Passwords do not match'
                return undefined
              },
            }}
          >
            {(field) => (
              <field.PasswordField label="Confirm Password" placeholder="Confirm your password" />
            )}
          </form.AppField>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <form.AppForm>
            <form.SubmitButton label="Sign up" pendingLabel="Creating account..." />
          </form.AppForm>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
