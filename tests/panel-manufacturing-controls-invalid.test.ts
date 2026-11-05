import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
import { toolingrailProps } from "lib/components/toolingrail"

test("panel manufacturing controls reject conflicting and impossible dimensions", () => {
  for (const rawProps of [
    { tabCountPerEdge: 2, tabs: [] },
    { tabCountPerEdge: 1.5 },
    { tabCountPerEdge: 0 },
    { tabs: [{ edge: "top", offset: "-1mm" }] },
    { tabKeepouts: [{ edge: "left", from: "5mm", to: "2mm" }] },
    { minWidth: "100mm", maxWidth: "50mm" },
    { minHeight: "100mm", maxHeight: "50mm" },
    { minWidth: 0 },
    { maxHeight: Number.POSITIVE_INFINITY },
    { panelizationMethod: "v-score" },
  ])
    expect(panelProps.safeParse(rawProps).success).toBe(false)
  for (const width of [0, "-5mm", Number.POSITIVE_INFINITY])
    expect(toolingrailProps.safeParse({ side: "left", width }).success).toBe(
      false,
    )
})

test("omitted panel controls have no manufacturing limits or tab overrides", () => {
  const parsed = panelProps.parse({})
  for (const prop of [
    "tabs",
    "tabCountPerEdge",
    "tabKeepouts",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
  ])
    expect(parsed).not.toHaveProperty(prop)
  expect(panelProps.parse({ tabs: [] })).toMatchObject({ tabs: [] })
})
