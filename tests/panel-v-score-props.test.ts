import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
import { subpanelProps } from "lib/components/subpanel"

test("vScore is an optional boolean that conflicts with mouseBites", () => {
  expect(panelProps.parse({ vScore: true })).toMatchObject({ vScore: true })
  expect(panelProps.parse({ vScore: true, mouseBites: false })).toMatchObject({
    vScore: true,
    mouseBites: false,
  })
  expect(panelProps.parse({ vScore: false, mouseBites: true })).toMatchObject({
    vScore: false,
    mouseBites: true,
  })
  expect(panelProps.parse({})).not.toHaveProperty("vScore")

  const conflict = panelProps.safeParse({ vScore: true, mouseBites: true })
  expect(conflict.success).toBe(false)
  expect(conflict.error?.issues[0]?.path).toEqual(["vScore"])
  expect(
    subpanelProps.safeParse({ vScore: true, mouseBites: true }).success,
  ).toBe(false)

  expect(panelProps.safeParse({ vScore: "yes" }).success).toBe(false)
  expect(panelProps.safeParse({ panelizationMethod: "v_score" }).success).toBe(
    false,
  )
})
