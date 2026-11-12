import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("endpoint arrays cannot be drivers or wrapped differential pairs", () => {
  const arrayDriver = (
    // @ts-expect-error An array is never a differential driver.
    <simulation.pcbchannel {...data} driverRef={[".TX > .P", ".TX > .N"]} />
  )
  expect(pcbChannelProps.safeParse(arrayDriver.props).success).toBe(false)
  for (const driverRef of [
    { pin: [".TX > .P", ".TX > .N"] },
    { p: ".TX > .P" },
    { p: ".TX > .P", n: ".TX > .N", model: "wrong_wrapper" },
    { pin: ".TX > .Y", model: { p: "Model_579", n: "Model_771" } },
    { pin: { p: ".TX > .P", n: ".TX > .N" }, model: { p: "Model_579" } },
    { pin: { p: ".TX > .P", n: ".TX > .N" }, model: { p: "", n: "N" } },
    {
      pin: { p: ".TX > .P", n: ".TX > .N" },
      model: { p: "P", n: "N", extra: "invalid" },
    },
  ]) {
    expect(pcbChannelProps.safeParse({ ...data, driverRef }).success).toBe(
      false,
    )
  }
  expect(pcbChannelProps.safeParse({ ...data, receiverRef: [] }).success).toBe(
    false,
  )
})
