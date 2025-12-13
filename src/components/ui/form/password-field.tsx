"use client"

import * as React from "react"
import { useFieldContext } from "./form-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PasswordFieldProps extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "onBlur" | "type"> {
  label: string
}

export function PasswordField({ label, id: propId, className, ...props }: PasswordFieldProps) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const generatedId = React.useId()
  const id = propId ?? `${generatedId}-form-item`
  const formMessageId = `${generatedId}-form-item-message`

  return (
    <div className="grid gap-2">
      <Label
        htmlFor={id}
        data-error={hasError}
        className="data-[error=true]:text-destructive"
      >
        {label}
      </Label>
      <Input
        id={id}
        type="password"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? formMessageId : undefined}
        className={className}
        {...props}
      />
      {hasError && (
        <p id={formMessageId} className="text-destructive text-sm">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  )
}
