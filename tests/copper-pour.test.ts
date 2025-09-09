import { expect, test } from "bun:test"
import {
  copperPourProps,
  type CopperPourProps,
} from "lib/components/copper-pour"
import { expectTypeOf } from "expect-type"

test("should parse copper pour with boardOutline region", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    region: { strategy: "boardOutline" },
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.connectsTo).toBe("gnd")
  expect(parsed.layer).toBe("top")
  expect(parsed.region.strategy).toBe("boardOutline")
})

test("should parse copper pour with rect region", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    region: { strategy: "rect", x: 0, y: 0, width: 10, height: 10 },
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.region.strategy).toBe("rect")
  if (parsed.region.strategy === "rect") {
    expect(parsed.region.width).toBe(10)
  }
})

test("should parse copper pour with polygon region", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    region: {
      strategy: "polygon",
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
    },
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.region.strategy).toBe("polygon")
  if (parsed.region.strategy === "polygon") {
    expect(parsed.region.points).toHaveLength(3)
  }
})

test("should parse copper pour with aroundComponents region", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    region: {
      strategy: "aroundComponents",
      refDes: ["U1", "U2"],
    },
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.region.strategy).toBe("aroundComponents")
  if (parsed.region.strategy === "aroundComponents") {
    expect(parsed.region.refDes).toEqual(["U1", "U2"])
  }
})

test("should parse copper pour with cutouts", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    region: { strategy: "boardOutline" },
    cutouts: [
      { strategy: "rect", x: 1, y: 1, width: 2, height: 2 },
      { strategy: "circle", cx: 5, cy: 5, r: 1 },
      {
        strategy: "polygon",
        points: [
          { x: 8, y: 8 },
          { x: 9, y: 8 },
          { x: 9, y: 9 },
        ],
      },
    ],
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.cutouts).toBeDefined()
  expect(parsed.cutouts!).toHaveLength(3)
  expect(parsed.cutouts![0]!.strategy).toBe("rect")
  expect(parsed.cutouts![1]!.strategy).toBe("circle")
  expect(parsed.cutouts![2]!.strategy).toBe("polygon")
})

test("type inference for CopperPourProps", () => {
  const props: CopperPourProps = {
    connectsTo: "gnd",
    layer: "bottom",
    padMargin: 1,
    region: { strategy: "boardOutline" },
  }
  expectTypeOf(props).toMatchTypeOf<CopperPourProps>()
})

test("should fail without region", () => {
  const rawProps: any = {
    connectsTo: "gnd",
    layer: "top",
  }
  expect(() => copperPourProps.parse(rawProps)).toThrow()
})
