import { z } from "zod"

export const url = z.preprocess((value) => {
  if (value && typeof value === "object" && "default" in value) {
    return (value as { default?: unknown }).default
  }

  return value
}, z.string()) as unknown as z.ZodType<string, string>
