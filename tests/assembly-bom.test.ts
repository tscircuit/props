import { expect, test } from "bun:test"
import { assemblyBomProps, assemblyProps, type AssemblyPartProps } from "lib"

const examples = [
  [assemblyProps.part, { name: "screw" }],
  [assemblyProps.fastener, { name: "screw" }],
  [assemblyProps.bolt, { name: "screw", diameter: 3, length: 8 }],
  [assemblyProps.subassembly, { name: "housing" }],
  [assemblyProps.cadassembly, { name: "housing" }],
  [assemblyProps.device, { name: "device" }],
  [assemblyProps.printedpart, { name: "bracket", model: "soic8" }],
  [assemblyProps.motor, { name: "motor", standard: "nema17" }],
  [
    assemblyProps.screen,
    { name: "screen", connectsTo: ".J1", width: 20, height: 10 },
  ],
  [assemblyProps.cable, { name: "cable", from: ".J1", to: ".J2" }],
] as const

test("assembly material schemas preserve BOM metadata independently of CAD inputs", () => {
  const metadata = {
    bomQuantity: 4,
    purchaseUrls: [
      "https://amazon.com/dp/example",
      "https://store.example/screw",
    ],
    supplierPartNumbers: { mouser: ["M3-8"], jlcpcb: ["C1", "C2"] },
  } satisfies Omit<AssemblyPartProps, "name">
  for (const [schema, identity] of examples) {
    const parsed = schema.parse({ ...identity, ...metadata })
    expect(parsed).toMatchObject(metadata)
    expect(schema.parse(identity)).not.toHaveProperty("bomQuantity")
  }
  expect(assemblyBomProps.parse({})).toEqual({})
  expect(
    assemblyBomProps.parse({ purchaseUrls: [], supplierPartNumbers: {} }),
  ).toEqual({ purchaseUrls: [], supplierPartNumbers: {} })
})

test("BOM counts and purchase URLs validate at the authoring boundary", () => {
  for (const bomQuantity of [
    0,
    -1,
    1.5,
    Infinity,
    NaN,
    Number.MAX_SAFE_INTEGER + 1,
    "4",
  ]) {
    expect(assemblyBomProps.safeParse({ bomQuantity }).success).toBe(false)
  }
  for (const purchaseUrls of [
    ["javascript:alert(1)"],
    ["file:///part"],
    ["/part"],
    ["https://good.example", "bad"],
    "https://store.example",
  ]) {
    expect(assemblyBomProps.safeParse({ purchaseUrls }).success).toBe(false)
  }
  expect(
    assemblyBomProps.safeParse({ supplierPartNumbers: { amazon: ["sku"] } })
      .success,
  ).toBe(false)
  expect(
    assemblyBomProps.parse({
      bomQuantity: Number.MAX_SAFE_INTEGER,
      purchaseUrls: ["http://store.example/part"],
    }).bomQuantity,
  ).toBe(Number.MAX_SAFE_INTEGER)
})
