import { expect, test } from "bun:test"
import { panelProps, type PanelProps } from "lib/components/panel"

test("should parse outline routing panelization", () => {
  const raw: PanelProps = {
    name: "panel",
    panelizationMethod: "outline_routing",
  }

  const parsed = panelProps.parse(raw)

  expect(parsed.panelizationMethod).toBe("outline_routing")
})

test("should reject noncanonical outline routing spelling", () => {
  expect(
    panelProps.safeParse({
      name: "panel",
      panelizationMethod: "outline-routing",
    }).success,
  ).toBe(false)
})
