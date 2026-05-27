import { customDrcCheckFn, type CustomDrcCheckFn } from "lib/customDrc"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface DrcCheckProps {
  name?: string
  checkFn: CustomDrcCheckFn
}

export const drcCheckProps = z.object({
  name: z.string().optional(),
  checkFn: customDrcCheckFn,
})

type InferredDrcCheckProps = z.input<typeof drcCheckProps>
expectTypesMatch<DrcCheckProps, InferredDrcCheckProps>(true)
