import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Turns a Supabase/Postgrest error (or any thrown value) into a short,
 * human-readable string for a toast. Surfaces the constraint hint when
 * Postgres provides one (e.g. the booking slot uniqueness violation),
 * so a collision reads as "that slot was just taken" instead of a raw
 * "duplicate key value violates unique constraint …" or a silent failure.
 */
export function describeError(error: unknown): string {
  if (isPostgrestError(error)) {
    const parts = [error.message];
    if (error.hint) parts.push(error.hint);
    if (error.code === "23505") {
      return "That slot was just taken by another booking — pick a different time.";
    }
    return parts.join(" — ");
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
}
