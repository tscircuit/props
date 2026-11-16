import { expect, test } from "bun:test"
import { diodeProps, type DiodeProps } from "lib/components/diode"
import { z } from "zod"

test("should parse diode props with single string connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
  })
})

test("should parse diode props with array connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: ["net.VCC", "net.5V"],
      cathode: ["net.GND", "net.0V"],
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: ["net.VCC", "net.5V"],
    cathode: ["net.GND", "net.0V"],
  })
})

test("should parse diode props with mixed string and array connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: ["net.GND", "net.0V"],
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: ["net.GND", "net.0V"],
  })
})

test("should parse diode props with all connection keys", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
      pin1: "net.PIN1",
      pin2: "net.PIN2",
      pos: "net.POS",
      neg: "net.NEG",
    },
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
    pin1: "net.PIN1",
    pin2: "net.PIN2",
    pos: "net.POS",
    neg: "net.NEG",
  })
})

test("should reject connections with invalid keys", () => {
  // Demonstrate that invalid keys throw a ZodError
  expect(() => {
    diodeProps.parse({
      name: "diode",
      connections: {
        invalidKey: "net.INVALID", // This should cause a parsing error
        anode: "net.VCC",
      } as unknown as DiodeProps,
    })
  }).toThrow(z.ZodError)
})

test("should handle empty string and array connection values", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "", // Empty string
      cathode: [], // Empty array
    },
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "",
    cathode: [],
  })
})

test("should allow optional connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})

test("should parse diode pinLabels", () => {
  const rawProps: DiodeProps<"A" | "K"> = {
    name: "diode",
    pinLabels: {
      anode: "A",
      cathode: "K",
      pin1: "A",
      pin2: "K",
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.pinLabels).toEqual({
    anode: "A",
    cathode: "K",
    pin1: "A",
    pin2: "K",
  })
})

test("should reject diode pinLabels with invalid pin keys", () => {
  expect(() => {
    diodeProps.parse({
      name: "diode",
      pinLabels: {
        gate: "G",
      },
    })
  }).toThrow(z.ZodError)
})

test("should reject diode pinLabels with invalid schematic labels", () => {
  expect(() => {
    diodeProps.parse({
      name: "diode",
      pinLabels: {
        anode: "A-B",
      },
    })
  }).toThrow(z.ZodError)
})

// New tests for diode variants

test("should default to standard variant when no variant is specified", () => {
  const rawProps: DiodeProps = {
    name: "diode",
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect({
    variant: parsedProps.variant,
    standard: parsedProps.standard,
    schottky: parsedProps.schottky,
    zener: parsedProps.zener,
    photo: parsedProps.photo,
    tvs: parsedProps.tvs,
  }).toMatchInlineSnapshot(`
    {
      "photo": false,
      "schottky": false,
      "standard": true,
      "tvs": false,
      "variant": "standard",
      "zener": false,
    }
  `)
})

test("should set the schottky flag when variant is schottky", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    variant: "schottky",
  }
  const parsedProps = diodeProps.parse(rawProps)

  expect({
    variant: parsedProps.variant,
    standard: parsedProps.standard,
    schottky: parsedProps.schottky,
    zener: parsedProps.zener,
    photo: parsedProps.photo,
    tvs: parsedProps.tvs,
  }).toMatchInlineSnapshot(`
    {
      "photo": false,
      "schottky": true,
      "standard": false,
      "tvs": false,
      "variant": "schottky",
      "zener": false,
    }
  `)
})

test("should set the zener flag when variant is zener", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    variant: "zener",
  }
  const parsedProps = diodeProps.parse(rawProps)

  expect({
    variant: parsedProps.variant,
    standard: parsedProps.standard,
    schottky: parsedProps.schottky,
    zener: parsedProps.zener,
    photo: parsedProps.photo,
    tvs: parsedProps.tvs,
  }).toMatchInlineSnapshot(`
    {
      "photo": false,
      "schottky": false,
      "standard": false,
      "tvs": false,
      "variant": "zener",
      "zener": true,
    }
  `)
})

test("should set the photo flag when variant is photo", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    variant: "photo",
  }
  const parsedProps = diodeProps.parse(rawProps)

  expect({
    variant: parsedProps.variant,
    standard: parsedProps.standard,
    schottky: parsedProps.schottky,
    zener: parsedProps.zener,
    photo: parsedProps.photo,
    tvs: parsedProps.tvs,
  }).toMatchInlineSnapshot(`
    {
      "photo": true,
      "schottky": false,
      "standard": false,
      "tvs": false,
      "variant": "photo",
      "zener": false,
    }
  `)
})

test("should set the tvs flag when variant is tvs", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    variant: "tvs",
  }
  const parsedProps = diodeProps.parse(rawProps)

  expect({
    variant: parsedProps.variant,
    standard: parsedProps.standard,
    schottky: parsedProps.schottky,
    zener: parsedProps.zener,
    photo: parsedProps.photo,
    tvs: parsedProps.tvs,
  }).toMatchInlineSnapshot(`
    {
      "photo": false,
      "schottky": false,
      "standard": false,
      "tvs": true,
      "variant": "tvs",
      "zener": false,
    }
  `)
})

test("should reject invalid variant values", () => {
  expect(() => {
    diodeProps.parse({
      name: "diode",
      variant: "invalid-variant" as any,
    })
  }).toThrow(z.ZodError)
})

test("should throw error when multiple variant flags are set directly", () => {
  expect(() => {
    diodeProps.parse({
      name: "diode",
      schottky: true,
      zener: true,
    } as DiodeProps)
  }).toThrow("Exactly one diode variant must be enabled")
})

test("should accept variant with connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    variant: "schottky",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
    },
  }
  const parsedProps = diodeProps.parse(rawProps)

  expect({
    variant: parsedProps.variant,
    schottky: parsedProps.schottky,
    connections: parsedProps.connections,
  }).toMatchInlineSnapshot(`
    {
      "connections": {
        "anode": "net.VCC",
        "cathode": "net.GND",
      },
      "schottky": true,
      "variant": "schottky",
    }
  `)
})

test("should parse schOrientation for diode", () => {
  const raw = {
    name: "d1",
    schOrientation: "horizontal",
  }
  const parsed = diodeProps.parse(raw)
  expect(parsed.schOrientation).toBe("horizontal")
})

const variantFlags = [
  "standard",
  "schottky",
  "zener",
  "avalanche",
  "photo",
  "tvs",
] as const

for (const flag of variantFlags) {
  test(`should enable only the ${flag} boolean flag`, () => {
    const parsed = diodeProps.parse({ name: "D1", [flag]: true })
    expect(variantFlags.filter((key) => parsed[key])).toEqual([flag])
  })

  test(`should prefer the ${flag} boolean flag over variant`, () => {
    const variant = flag === "photo" ? "zener" : "photo"
    const parsed = diodeProps.parse({ name: "D1", variant, [flag]: true })
    expect(variantFlags.filter((key) => parsed[key])).toEqual([flag])
  })
}

test("should enable only avalanche when selected by variant", () => {
  const parsed = diodeProps.parse({ name: "D1", variant: "avalanche" })
  expect(variantFlags.filter((key) => parsed[key])).toEqual(["avalanche"])
})

test("should default to standard when avalanche is false or omitted", () => {
  for (const avalanche of [false, undefined]) {
    const parsed = diodeProps.parse({ name: "D1", avalanche })
    expect(variantFlags.filter((key) => parsed[key])).toEqual(["standard"])
  }
})

test("should use variant when the avalanche boolean flag is false", () => {
  const parsed = diodeProps.parse({
    name: "D1",
    avalanche: false,
    variant: "photo",
  })
  expect(variantFlags.filter((key) => parsed[key])).toEqual(["photo"])
})

for (const flag of variantFlags.filter((key) => key !== "avalanche")) {
  test(`should reject avalanche together with the ${flag} flag`, () => {
    expect(() =>
      diodeProps.parse({ name: "D1", avalanche: true, [flag]: true }),
    ).toThrow("Exactly one diode variant must be enabled")
  })
}

test("should not mutate the input when normalizing avalanche", () => {
  const raw: DiodeProps = Object.freeze({ name: "D1", avalanche: true })
  const parsed = diodeProps.parse(raw)
  expect(raw).toEqual({ name: "D1", avalanche: true })
  expect(parsed).not.toBe(raw)
  expect(variantFlags.filter((key) => parsed[key])).toEqual(["avalanche"])
})
