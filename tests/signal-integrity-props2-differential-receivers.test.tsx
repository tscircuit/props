import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, parseBlock } from "./signal-integrity-fixtures"

test("Level 1 differential TSX uses objects, and multi-drop arrays stay receivers", () => {
  const driverRef = { p: ".TX > .A", n: ".TX > .B" }
  const receiverRef = { p: ".RX > .A", n: ".RX > .B" }
  const { block, signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation bitRate="250kbps">
      <simulation.pcbchannel
        name="BUS"
        driverRef={driverRef}
        receiverRef={receiverRef}
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(block.bitRate).toBe(250e3)
  expect(signals[0]).toMatchObject({ driverRef, receiverRef })

  const receivers = [
    receiverRef,
    { pin: receiverRef, model: "BUS_ODT" },
    ".RX3 > .A",
    ".RX4 > .A",
  ]
  const bus = (
    <simulation.pcbchannel
      name="BUS"
      driverRef={{ pin: driverRef, model: "BUS_DRIVE" }}
      receiverRef={receivers}
    />
  )
  expect(pcbChannelProps.parse(bus.props)).toMatchObject({
    driverRef: { pin: driverRef, model: "BUS_DRIVE" },
    receiverRef: receivers,
  })
  expect(
    pcbChannelProps.parse({
      ...bus.props,
      receiverRef: [".RX > .A", ".RX > .B"],
    }).receiverRef,
  ).toEqual([".RX > .A", ".RX > .B"])
})
