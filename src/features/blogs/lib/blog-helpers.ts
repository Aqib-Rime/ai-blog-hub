import { format } from 'date-fns'

/**
 * Extracts a typed field from a Payload CMS relationship field.
 * Handles cases where the field might be a string ID, number, or the actual object.
 *
 * @param field - The field to extract from
 * @returns The typed object or null if not an object
 */
export function extractTypedField<T>(field: T | string | number | null | undefined): T | null {
  return typeof field === 'object' && field !== null ? field : null
}

/**
 * Formats a date string into a human-readable format.
 *
 * @param date - ISO date string from Payload CMS
 * @returns Formatted date string (e.g., "January 15, 2024") or empty string if date is null/undefined
 */
export function formatPublishDate(date: string | null | undefined): string {
  return date ? format(new Date(date), 'MMMM d, yyyy') : ''
}
