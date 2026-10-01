import { expect, test } from "bun:test"
import { chipProps, type ChipProps, type PinAttributeMap } from "lib"

test("firmware props normalize bit rates and preserve explicit false and none", () => {
  const props: ChipProps = {
    name: "U1",
    firmwareRtos: "nortos",
    firmwareLfClockSource: "internal_rc",
    pinAttributes: {
      pin1: { isGpio: true, isOutput: true, initialOutputState: "low" },
      pin2: { isInput: true, interruptTrigger: "none", doNotConfigure: false },
      pin3: { activeCapability: "i2c_scl", i2cMaxBitRate: "100kbps" },
    },
  }
  expect(chipProps.parse(props)).toMatchObject({
    ...props,
    pinAttributes: {
      ...props.pinAttributes,
      pin3: { activeCapability: "i2c_scl", i2cMaxBitRate: 100000 },
    },
  })
  const empty = chipProps.parse({ name: "U1", pinAttributes: { pin1: {} } })
  expect(empty.pinAttributes?.pin1).toEqual({})
  expect(empty.firmwareRtos).toBeUndefined()
  expect(empty.firmwareLfClockSource).toBeUndefined()
})

test("firmware props reject invalid states, rates and MCU settings", () => {
  for (const attributes of [
    { initialOutputState: "default" },
    { interruptTrigger: "level" },
    { i2cMaxBitRate: "100kHz" },
    { i2cMaxBitRate: 0 },
    { doNotConfigure: "true" },
  ]) {
    expect(
      chipProps.safeParse({ name: "U1", pinAttributes: { pin1: attributes } })
        .success,
    ).toBe(false)
  }
  for (const props of [
    { firmwareRtos: "automatic" },
    { firmwareLfClockSource: "automatic" },
  ]) {
    expect(chipProps.safeParse({ name: "U1", ...props }).success).toBe(false)
  }
})

test("firmware settings remain typed at the author boundary", () => {
  // @ts-expect-error Startup levels must be explicit low or high.
  const attributes: PinAttributeMap = { initialOutputState: true }
  void attributes
})
