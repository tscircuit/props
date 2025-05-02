import { expectTypesMatch } from "lib/typecheck"
import { test } from "bun:test"
import type { DiodeProps } from "lib"

const diodePinLabels = {
  anode: "A",
  cathode: "K",
} as const

test("[typetest] test connections prop in DiodeProps", () => {
  const validConnections1: DiodeProps = {
    name: "D1",
    pinLabels: diodePinLabels,
    connections: {
      A: "Power",
      K: "Ground",
    },
  }

  const validConnections2: DiodeProps = {
    name: "D2",
    pinLabels: diodePinLabels,
    connections: {
      A: ["Power", "Vcc"],
      K: ["Ground"],
    },
  }

  const validConnections3: DiodeProps = {
    name: "D3",
    pinLabels: diodePinLabels,
    connections: {
      A: ["Power"] as const,
      K: ["Ground"] as const,
    },
  }

  expectTypesMatch<typeof validConnections1, DiodeProps>(true)
  expectTypesMatch<typeof validConnections2, DiodeProps>(true)
  expectTypesMatch<typeof validConnections3, DiodeProps>(true)
})
