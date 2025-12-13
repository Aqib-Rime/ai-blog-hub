"use client"

import { useFormContext } from "./form-context"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, "type" | "disabled"> {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel, children, ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting} {...props}>
          {children ?? (isSubmitting ? (pendingLabel ?? label) : label)}
        </Button>
      )}
    </form.Subscribe>
  )
}
