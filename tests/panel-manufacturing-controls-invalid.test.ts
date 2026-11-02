import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
import { toolingrailProps } from "lib/components/toolingrail"

test("panel manufacturing controls reject conflicting and impossible dimensions", () => {
  for (const rawProps of [
    { tabPlacement: { countPerEdge: 2, positions: [] } },
    { tabPlacement: { countPerEdge: 1.5 } },
    { tabPlacement: { positions: [{ edge: "top", offset: "-1mm" }] } },
    { tabPlacement: { keepouts: [{ edge: "left", from: "5mm", to: "2mm" }] } },
    { sizeConstraints: { minWidth: "100mm", maxWidth: "50mm" } },
    { sizeConstraints: { minHeight: "100mm", maxHeight: "50mm" } },
    { sizeConstraints: { minWidth: 0 } },
    { panelizationMethod: "v-score" },
  ])
    expect(panelProps.safeParse(rawProps).success).toBe(false)
  for (const width of [0, "-5mm", Number.POSITIVE_INFINITY])
    expect(toolingrailProps.safeParse({ side: "left", width }).success).toBe(
      false,
    )
})
