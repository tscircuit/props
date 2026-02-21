import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"

test("pinAttributes allows mustBeConnected", () => {
  const rawProps = {
    name: "chip",
    pinAttributes: {
      pin1: {
        mustBeConnected: true,
        isI2cSda: true,
        canUseInternalPullup: true,
        isUsingInternalPullup: true,
        canUseOpenDrain: true,
        isUsingOpenDrain: true,
      },
      pin2: {
        mustBeConnected: false,
        isSpiMiso: true,
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
  expect(parsed.pinAttributes?.pin1?.isI2cSda).toBe(true)
  expect(parsed.pinAttributes?.pin1?.canUseInternalPullup).toBe(true)
  expect(parsed.pinAttributes?.pin1?.isUsingInternalPullup).toBe(true)
  expect(parsed.pinAttributes?.pin1?.canUseOpenDrain).toBe(true)
  expect(parsed.pinAttributes?.pin1?.isUsingOpenDrain).toBe(true)
  expect(parsed.pinAttributes?.pin2?.isSpiMiso).toBe(true)
  expect(parsed.pinAttributes?.pin2?.canUseInternalPulldown).toBe(true)
  expect(parsed.pinAttributes?.pin2?.needsExternalPulldown).toBe(true)
  expect(parsed.pinAttributes?.pin2?.canUsePushPull).toBe(true)
  expect(parsed.pinAttributes?.pin2?.isUsingPushPull).toBe(true)
})
