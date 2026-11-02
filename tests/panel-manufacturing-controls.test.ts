import { expect, test } from "bun:test"
import { panelProps } from "lib/components/panel"
import { toolingrailProps } from "lib/components/toolingrail"

test("panel manufacturing controls preserve explicit author intent", () => {
  expect(toolingrailProps.parse({ side: "left", width: "5mm" })).toMatchObject({
    side: "left",
    width: 5,
  })
  expect(
    panelProps.parse({ panelizationMethod: "v_score", boardGap: "0mm" })
      .panelizationMethod,
  ).toBe("v_score")
  expect(
    panelProps.parse({
      tabPlacement: {
        countPerEdge: 2,
        keepouts: [{ edge: "top", from: "2mm", to: "4mm" }],
      },
    }),
  ).toMatchObject({
    tabPlacement: {
      countPerEdge: 2,
      keepouts: [{ edge: "top", from: 2, to: 4 }],
    },
  })
  expect(
    panelProps.parse({
      tabPlacement: {
        positions: [{ boardName: "B1", edge: "right", offset: "6mm" }],
      },
    }),
  ).toMatchObject({
    tabPlacement: {
      positions: [{ boardName: "B1", edge: "right", offset: 6 }],
    },
  })
  expect(
    panelProps.parse({
      sizeConstraints: {
        minWidth: "50mm",
        maxWidth: "250mm",
        minHeight: "40mm",
        maxHeight: "200mm",
      },
    }),
  ).toMatchObject({
    sizeConstraints: {
      minWidth: 50,
      maxWidth: 250,
      minHeight: 40,
      maxHeight: 200,
    },
  })
})
