import { expect, test } from "bun:test"
import { boardProps, type BoardProps } from "lib/components/board"
import type { PcbStackupInput } from "circuit-json"

const stackup: PcbStackupInput = {
  source: "specified",
  layers: [
    {
      type: "copper",
      layer: "top",
      thickness_mm: 0.035,
      conductivity_s_per_m: 5.8e7,
    },
    {
      type: "dielectric",
      thickness_mm: 0.2,
      dielectric_constant: 4.1,
      dielectric_constant_frequency_hz: 1e9,
      dielectric_loss_tangent: 0.02,
      dielectric_loss_tangent_frequency_hz: 1e9,
    },
    { type: "copper", layer: "bottom" },
  ],
}

test("board stackup preserves canonical physical fields and provenance", () => {
  const input: BoardProps = { layers: 2, stackup }
  const original = structuredClone(input)
  expect(boardProps.parse(input).stackup).toEqual(stackup)
  expect(input).toEqual(original)
  const unknown: PcbStackupInput = {
    source: "assumed",
    layers: [
      { type: "copper", layer: "top" },
      { type: "dielectric" },
      { type: "copper", layer: "bottom" },
    ],
  }
  expect(boardProps.parse({ stackup: unknown }).stackup).toEqual(unknown)
})

test("material and fabricator preset do not supply physical stackup", () => {
  expect(boardProps.parse({}).stackup).toBeUndefined()
  expect(
    boardProps.parse({ material: "fr4", fabricatorPreset: "jlcpcb_standard" })
      .stackup,
  ).toBeUndefined()
})

test("board stackup uses the canonical nested validation", () => {
  for (const invalid of [null, {}, { ...stackup, source: "verified" }])
    expect(boardProps.safeParse({ stackup: invalid }).success).toBe(false)
})
