import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { extractInterfaces } from "../scripts/generate-component-types"

test("completes nested union expressions and trailing validator chains", () => {
  const definition = `export const schema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("input") }).strict(),
  z.object({
    kind: z.literal("output"),
    text: z.literal("})]"),
    pattern: z.string().regex(/[(){}]/),
    // Delimiters in comments: ) ] }
  }).strict(),
]).superRefine((value, ctx) => {
  if (value.kind === "output") {
    ctx.addIssue({ message: "example" })
  }
})`
  expect(extractInterfaces(`${definition}\n`)).toEqual([`${definition}\n`])
})

test("completes IBIS and digital stimulus validators from their source", () => {
  const ibis = readFileSync("lib/common/ibis.ts", "utf8")
  const ibisDeclaration = ibis.slice(
    ibis.indexOf("export const ibisPinRunState"),
    ibis.indexOf("export type IbisPinRunState"),
  )
  expect(extractInterfaces(ibis).join("")).toContain(ibisDeclaration)

  const digital = readFileSync(
    "lib/components/analogdigitalstimulus.ts",
    "utf8",
  )
  const digitalDeclaration = digital.slice(
    digital.indexOf("export const analogDigitalStimulusProps"),
    digital.indexOf("expectTypesMatch<"),
  )
  expect(extractInterfaces(digital).join("")).toContain(digitalDeclaration)
})

test("keeps legacy selections and separately emitted extensions unchanged", () => {
  const source = `export const hidden = z.string()
export interface Props {
  name: string
}
export const props = base
  .omit({ old: true })
  .extend({
    name: z.string(),
  })
export type PropsInput = z.input<typeof props>
`
  expect(extractInterfaces(source)).toEqual([
    "export interface Props {\n  name: string\n}\n",
    "export const props = base\n  .omit({ old: true })\n",
    ".extend({\n    name: z.string(),\n  })\n",
  ])
})
