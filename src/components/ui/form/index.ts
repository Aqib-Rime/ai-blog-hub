"use client"

import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./form-context"
import { TextField } from "./text-field"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    SubmitButton,
  },
})

// Re-export contexts for custom components
export { fieldContext, formContext, useFieldContext, useFormContext } from "./form-context"

// Re-export field components for direct use if needed
export { TextField } from "./text-field"
export { PasswordField } from "./password-field"
export { SubmitButton } from "./submit-button"
