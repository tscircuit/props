import { beforeAll, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import type { PcbSolderPastePill } from "circuit-json"
import { KicadFootprintToCircuitJsonConverter } from "kicad-to-circuit-json"
import { solderPasteProps } from "../lib"

const converter = new KicadFootprintToCircuitJsonConverter()
converter.addFile(
  "USB_A_Receptacle_GCT_USB1046.kicad_mod",
  readFileSync(
    new URL(
      "./assets/usb1046/USB_A_Receptacle_GCT_USB1046.kicad_mod",
      import.meta.url,
    ),
    "utf8",
  ),
)
converter.runUntilFinished()
const apertures = converter
  .getOutput()
  .filter(
    (element): element is PcbSolderPastePill =>
      element.type === "pcb_solder_paste" && element.shape === "pill",
  )

beforeAll(() => {
  expect(apertures).toHaveLength(6)
})

test("solder paste props retain the real USB1046 stencil geometry", () => {
  for (const aperture of apertures) {
    const input = {
      shape: aperture.shape,
      width: aperture.width,
      height: aperture.height,
      radius: aperture.radius,
      pcbX: aperture.x,
      pcbY: aperture.y,
      layer: aperture.layer,
    }
    expect(solderPasteProps.parse(input)).toMatchObject(input)
  }
})
