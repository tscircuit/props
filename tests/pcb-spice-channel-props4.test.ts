import { expect, test } from "bun:test"
import { ibisModelAsset } from "../lib"

test("IBIS model asset accepts an optional case-insensitive SHA-256 digest", () => {
  const asset = {
    project_relative_path: "models/chip.ibs",
    url: "models/chip.ibs",
    mimetype: "text/plain",
  }
  const sha256 = "Ab01".repeat(16)
  expect(ibisModelAsset.parse({ ...asset, sha256 })).toEqual({
    ...asset,
    sha256,
  })
  expect(ibisModelAsset.parse(asset)).toEqual(asset)
  for (const sha256 of ["a".repeat(63), "a".repeat(65), "z".repeat(64)]) {
    expect(() => ibisModelAsset.parse({ ...asset, sha256 })).toThrow()
  }
})
