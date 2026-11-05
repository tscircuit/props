import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
test("finished panel size limits normalize units and reject impossible bounds", () => {
  expect(
    panelProps.parse({
      minWidth: "50mm",
      maxWidth: "250mm",
      minHeight: "40mm",
      maxHeight: "200mm",
    }),
  ).toMatchObject({
    minWidth: 50,
    maxWidth: 250,
    minHeight: 40,
    maxHeight: 200,
  })
  for (const bounds of [
    { minWidth: 0 },
    { maxHeight: Infinity },
    { minWidth: 100, maxWidth: 50 },
    { minHeight: 100, maxHeight: 50 },
  ])
    expect(panelProps.safeParse(bounds).success).toBe(false)
  expect(panelProps.parse({})).not.toHaveProperty("minWidth")
})
