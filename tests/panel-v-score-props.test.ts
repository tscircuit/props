import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
test("V-score uses the canonical panelization enum without changing defaults", () => {
  expect(
    panelProps.parse({ panelizationMethod: "v_score", boardGap: "0mm" }),
  ).toMatchObject({ panelizationMethod: "v_score", boardGap: 0 })
  expect(panelProps.safeParse({ panelizationMethod: "v-score" }).success).toBe(
    false,
  )
  expect(panelProps.parse({})).not.toHaveProperty("panelizationMethod")
})
