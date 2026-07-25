import { expect, test } from "bun:test"
import { pinHeaderProps } from "lib/components/pin-header"

const parse = (pinCount: unknown) =>
  pinHeaderProps.safeParse({ name: "H1", pinCount })

test("pinCount accepts whole positive counts", () => {
  expect(parse(1).success).toBe(true)
  expect(parse(4).success).toBe(true)
  expect(parse(40).success).toBe(true)
})

test("pinCount rejects a fractional count", () => {
  // Previously accepted. A fractional count produced a header whose port count
  // and pad count disagreed (pinCount 2.5 -> 2 source_ports but 3 pads) with no
  // error raised anywhere.
  expect(parse(2.5).success).toBe(false)
  expect(parse(3.7).success).toBe(false)
})

test("pinCount rejects zero and negative counts", () => {
  // A header with no pins is not a header; these previously reached the renderer
  // and surfaced later as an unrelated pcb_missing_footprint_error.
  expect(parse(0).success).toBe(false)
  expect(parse(-4).success).toBe(false)
})

test("pinCount rejects non-finite counts", () => {
  expect(parse(Number.NaN).success).toBe(false)
  expect(parse(Number.POSITIVE_INFINITY).success).toBe(false)
})

test("pinCount is still required", () => {
  // The guard must not turn a required prop into an optional one.
  expect(pinHeaderProps.safeParse({ name: "H1" }).success).toBe(false)
})

test("a valid pinCount still parses to the same value", () => {
  const result = pinHeaderProps.safeParse({ name: "H1", pinCount: 8 })

  expect(result.success).toBe(true)
  if (result.success) expect(result.data.pinCount).toBe(8)
})
