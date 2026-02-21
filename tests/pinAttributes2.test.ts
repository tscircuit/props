import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"

test("pinAttributes allows mustBeConnected", () => {
  const rawProps = {
    name: "chip",
    pinAttributes: {
      pin1: {
        mustBeConnected: true,
        capabilities: ["i2c_sda", "i2c_scl"],
        activeCapabilities: ["i2c_sda"],
        activeCapability: "i2c_sda",
        canUseInternalPullup: true,
        isUsingInternalPullup: true,
        canUseOpenDrain: true,
        isUsingOpenDrain: true,
      },
      pin2: {
        mustBeConnected: false,
        capabilities: ["spi_miso", "spi_mosi", "spi_sck", "spi_cs"],
        activeCapability: "spi_miso",
        canUseInternalPulldown: true,
        needsExternalPulldown: true,
        canUsePushPull: true,
        isUsingPushPull: true,
      },
    },
  }

  const parsed = chipProps.parse(rawProps)
  expect(parsed.pinAttributes?.pin1?.mustBeConnected).toBe(true)
  expect(parsed.pinAttributes?.pin2?.mustBeConnected).toBe(false)
  expect(parsed.pinAttributes?.pin1?.capabilities).toEqual([
    "i2c_sda",
    "i2c_scl",
  ])
  expect(parsed.pinAttributes?.pin1?.activeCapabilities).toEqual(["i2c_sda"])
  expect(parsed.pinAttributes?.pin1?.activeCapability).toBe("i2c_sda")
  expect(parsed.pinAttributes?.pin1?.canUseInternalPullup).toBe(true)
  expect(parsed.pinAttributes?.pin1?.isUsingInternalPullup).toBe(true)
  expect(parsed.pinAttributes?.pin1?.canUseOpenDrain).toBe(true)
  expect(parsed.pinAttributes?.pin1?.isUsingOpenDrain).toBe(true)
  expect(parsed.pinAttributes?.pin2?.capabilities).toEqual([
    "spi_miso",
    "spi_mosi",
    "spi_sck",
    "spi_cs",
  ])
  expect(parsed.pinAttributes?.pin2?.activeCapability).toBe("spi_miso")
  expect(parsed.pinAttributes?.pin2?.canUseInternalPulldown).toBe(true)
  expect(parsed.pinAttributes?.pin2?.needsExternalPulldown).toBe(true)
  expect(parsed.pinAttributes?.pin2?.canUsePushPull).toBe(true)
  expect(parsed.pinAttributes?.pin2?.isUsingPushPull).toBe(true)
})
