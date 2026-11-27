import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { holeProps, type HoleProps } from "../lib/components/hole"
import type { z } from "zod"

test("circle holes compute missing diameter and accept pcbRotation", () => {
  const raw: HoleProps = {
    radius: 2,
    pcbRotation: 90,
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(raw)

  if (parsed.shape === undefined || parsed.shape === "circle") {
    expect(parsed.radius).toBe(2)
    expect(parsed.diameter).toBe(4)
    expect(parsed.pcbRotation).toBe(90)
  } else {
    throw new Error("Expected circle hole props")
  }
})

test("pill holes require width and height", () => {
  const raw: HoleProps = {
    shape: "pill",
    width: "4mm",
    height: "1.5mm",
    name: "slot",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(raw)

  if (parsed.shape === "pill") {
    expect(parsed.width).toBe(4)
    expect(parsed.height).toBe(1.5)
    expect(parsed.name).toBe("slot")
  } else {
    throw new Error("Expected pill hole props")
  }
})

test("oval holes require width and height", () => {
  const raw: HoleProps = {
    shape: "oval",
    width: "4mm",
    height: "1.5mm",
    name: "slot",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(raw)

  if (parsed.shape === "oval") {
    expect(parsed.width).toBe(4)
    expect(parsed.height).toBe(1.5)
    expect(parsed.name).toBe("slot")
  } else {
    throw new Error("Expected oval hole props")
  }
})

test("pill holes without required dimensions throw", () => {
  const raw = {
    shape: "pill",
    width: "4mm",
  }

  expect(() => holeProps.parse(raw)).toThrow()
})

test("circle holes accept holeDiameter alias and normalize to diameter and radius", () => {
  const rawFromIssue: HoleProps = {
    name: "H1",
    holeDiameter: "3.2mm",
    pcbX: -20,
    pcbY: 20,
  }

  expectTypeOf(rawFromIssue).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(rawFromIssue)

  if (parsed.shape === undefined || parsed.shape === "circle") {
    expect(parsed.name).toBe("H1")
    expect(parsed.diameter).toBe(3.2)
    expect(parsed.radius).toBe(1.6)
    expect(parsed.pcbX).toBe(-20)
    expect(parsed.pcbY).toBe(20)
    expect("holeDiameter" in parsed).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const numericParsed = holeProps.parse({
    shape: "circle",
    holeDiameter: 2,
  })
  if (numericParsed.shape === undefined || numericParsed.shape === "circle") {
    expect(numericParsed.diameter).toBe(2)
    expect(numericParsed.radius).toBe(1)
    expect("holeDiameter" in numericParsed).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const imperialParsed = holeProps.parse({
    holeDiameter: "0.08in",
  })
  if (imperialParsed.shape === undefined || imperialParsed.shape === "circle") {
    expect(imperialParsed.diameter).toBeCloseTo(2.032)
    expect(imperialParsed.radius).toBeCloseTo(1.016)
    expect("holeDiameter" in imperialParsed).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const diameterParsed = holeProps.parse({
    diameter: "1mm",
    pcbX: 0,
    pcbY: 5,
  })
  if (diameterParsed.shape === undefined || diameterParsed.shape === "circle") {
    expect(diameterParsed.diameter).toBe(1)
    expect(diameterParsed.radius).toBe(0.5)
    expect("holeDiameter" in diameterParsed).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }
})

test("circle holes accept matching diameter, holeDiameter, and radius combinations", () => {
  const sameAlias = holeProps.parse({
    diameter: "3.2mm",
    holeDiameter: 3.2,
  })
  if (sameAlias.shape === undefined || sameAlias.shape === "circle") {
    expect(sameAlias.diameter).toBe(3.2)
    expect(sameAlias.radius).toBe(1.6)
    expect("holeDiameter" in sameAlias).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const crossUnitAlias = holeProps.parse({
    diameter: "0.3in",
    holeDiameter: "7.62mm",
  })
  if (crossUnitAlias.shape === undefined || crossUnitAlias.shape === "circle") {
    expect(crossUnitAlias.diameter).toBeCloseTo(7.62)
    expect(crossUnitAlias.radius).toBeCloseTo(3.81)
    expect("holeDiameter" in crossUnitAlias).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const aliasWithRadius = holeProps.parse({
    holeDiameter: "4mm",
    radius: 2,
  })
  if (
    aliasWithRadius.shape === undefined ||
    aliasWithRadius.shape === "circle"
  ) {
    expect(aliasWithRadius.diameter).toBe(4)
    expect(aliasWithRadius.radius).toBe(2)
    expect("holeDiameter" in aliasWithRadius).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }

  const allThree = holeProps.parse({
    diameter: "4mm",
    holeDiameter: 4,
    radius: "2mm",
  })
  if (allThree.shape === undefined || allThree.shape === "circle") {
    expect(allThree.diameter).toBe(4)
    expect(allThree.radius).toBe(2)
    expect("holeDiameter" in allThree).toBe(false)
  } else {
    throw new Error("Expected circle hole props")
  }
})

test("circle holes require diameter, holeDiameter, or radius instead of producing NaN", () => {
  for (const input of [
    {},
    { pcbX: 0, pcbY: 0 },
    { shape: "circle", pcbX: 0, pcbY: 0 },
    { name: "H1", pcbX: -20, pcbY: 20 },
  ]) {
    const result = holeProps.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(JSON.stringify(result.error.issues)).toContain(
        "Circle hole requires diameter, holeDiameter, or radius",
      )
    }
  }
})

test("circle holes reject conflicting diameter, holeDiameter, and radius", () => {
  const cases = [
    {
      input: { diameter: "3.2mm", holeDiameter: "2mm" },
      message: "holeDiameter is an alias of diameter; they must match",
    },
    {
      input: { diameter: "4mm", radius: "3mm" },
      message: "radius must equal half of diameter",
    },
    {
      input: { holeDiameter: "4mm", radius: "3mm" },
      message: "radius must equal half of diameter",
    },
    {
      input: { diameter: "4mm", holeDiameter: "6mm", radius: "2mm" },
      message: "holeDiameter is an alias of diameter; they must match",
    },
    {
      input: { diameter: "4mm", holeDiameter: "4mm", radius: "1mm" },
      message: "radius must equal half of diameter",
    },
  ]

  for (const { input, message } of cases) {
    const result = holeProps.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(JSON.stringify(result.error.issues)).toContain(message)
    }
  }
})

test("holes reject non-positive or non-finite dimensions while allowing negative solderMaskMargin", () => {
  for (const input of [
    { diameter: 0 },
    { diameter: -1 },
    { diameter: "-1mm" },
    { diameter: Number.NaN },
    { diameter: Number.POSITIVE_INFINITY },
    { holeDiameter: 0 },
    { holeDiameter: "-2mm" },
    { holeDiameter: Number.POSITIVE_INFINITY },
    { radius: 0 },
    { radius: -0.5 },
    { radius: Number.NaN },
    { shape: "pill", width: 0, height: "1.5mm" },
    { shape: "oval", width: "4mm", height: -1 },
    { shape: "rect", width: Number.POSITIVE_INFINITY, height: "2mm" },
  ]) {
    const result = holeProps.safeParse(input)
    expect(result.success).toBe(false)
  }

  const negativeMargin = holeProps.parse({
    diameter: "1mm",
    solderMaskMargin: -0.1,
    coveredWithSolderMask: true,
  })
  if (negativeMargin.shape === undefined || negativeMargin.shape === "circle") {
    expect(negativeMargin.diameter).toBe(1)
    expect(negativeMargin.radius).toBe(0.5)
    expect(negativeMargin.solderMaskMargin).toBe(-0.1)
  } else {
    throw new Error("Expected circle hole props")
  }
})

test("rect holes require width and height", () => {
  const parsed = holeProps.parse({
    shape: "rect",
    width: "3mm",
    height: "2mm",
  })

  if (parsed.shape === "rect") {
    expect(parsed.width).toBe(3)
    expect(parsed.height).toBe(2)
  } else {
    throw new Error("Expected rect hole props")
  }

  expect(holeProps.safeParse({ shape: "rect", width: "3mm" }).success).toBe(
    false,
  )
})
