import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Optional page child. Metadata fields reference ISO 7200:2004. */
export interface AssemblyDrawingTitleBlockProps {
  name?: string
  title: string
  legalOwner?: string
  identificationNumber?: string
  revisionIndex?: string
  dateOfIssue?: string
  creator?: string
  approvalPerson?: string
  sheetNumber?: number
  numberOfSheets?: number
}
export const assemblyDrawingTitleBlockProps = z
  .object({
    name: z.string().optional(),
    title: z.string().min(1),
    legalOwner: z.string().optional(),
    identificationNumber: z.string().optional(),
    revisionIndex: z.string().optional(),
    dateOfIssue: z.string().optional(),
    creator: z.string().optional(),
    approvalPerson: z.string().optional(),
    sheetNumber: z.number().int().positive().optional(),
    numberOfSheets: z.number().int().positive().optional(),
  })
  .refine(
    (block) =>
      block.sheetNumber == null ||
      block.numberOfSheets == null ||
      block.sheetNumber <= block.numberOfSheets,
    {
      message: "sheetNumber must not exceed numberOfSheets",
      path: ["sheetNumber"],
    },
  )
expectTypesMatch<
  AssemblyDrawingTitleBlockProps,
  z.input<typeof assemblyDrawingTitleBlockProps>
>(true)
