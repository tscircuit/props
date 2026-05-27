import { expect, test } from "bun:test"
import { drcCheckProps, type DrcCheckProps } from "lib/components/drc-check"

test("should parse drc check props", () => {
  const checkFn: DrcCheckProps["checkFn"] = async ({
    isPulledDown,
    isConnected,
    select,
    selectAll,
  }) => {
    const chips = selectAll("chip")
    const firstChip = chips[0]
    const sda1 = select("U1.SDA")
    const sda2 = select("U2.SDA")
    const addr1 = firstChip?.getPort("ADDR1") ?? select("U1.ADDR1")
    const addr1SourcePort = addr1?.getSourcePort()
    const ground = select("net.GND")
    const sda1SourcePort = sda1?.getSourcePort()
    const sda2SourcePort = sda2?.getSourcePort()

    if (
      sda1 &&
      sda2 &&
      addr1 &&
      isConnected(sda1, sda2) &&
      (isPulledDown(addr1) || (ground && isConnected(addr1, ground)))
    ) {
      return {
        error_type: "source_i2c_misconfigured_error",
        message: "U1 and U2 share the same I2C address",
        source_port_ids: [
          ...(sda1SourcePort ? [sda1SourcePort.source_port_id] : []),
          ...(sda2SourcePort ? [sda2SourcePort.source_port_id] : []),
          ...(addr1SourcePort ? [addr1SourcePort.source_port_id] : []),
        ],
      }
    }
  }

  const raw: DrcCheckProps = {
    name: "i2c-address-conflict",
    checkFn,
  }
  const parsed = drcCheckProps.parse(raw)

  expect(parsed.name).toBe("i2c-address-conflict")
  expect(parsed.checkFn).toBe(checkFn)
})
