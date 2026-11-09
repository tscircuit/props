# PCB transient channel simulation props

The schemas `pcbTransientChannelSimulationProps`, `pcbChannelProps` and
`simulationIbisModelProps` implement [RFC #28](https://github.com/tscircuit/rfc/pull/28)
at `89a263537ebc143315849f005024f84c1efa5635`.

```tsx
import { simulation } from "@tscircuit/core"

<simulation.pcbtransientchannelsimulation bitRate="20Mbps">
  <simulation.pcbchannel name="DATA" driverRef=".TX > .Y" receiverRef=".RX > .A" />
</simulation.pcbtransientchannelsimulation>
```

Core owns element registration, selectors, topology diagnostics, normalized
quiet states and source emission. Rates parse to bit/s. Numeric times are
seconds; strings accept s, ms, us/µs/μs, ns, ps and fs. UI offsets remain strings
until resolved at the channel's own or inherited bit rate. For example, `0.5`
is half a second; `"0.5UI"` at 20 Mbps is 25 ns. UI durations resolve at the block
rate. Explicit duration is finite and positive; absence stays absent in core.
The pipeline records `S + 128 * max(UI_i)`, where
`S = max(offset_i + 16 * UI_i)` for switching channels; quiet-only blocks record
`32 * max(UI_i)`. Explicit durations are never extended.

Block defaults are corner `typical`, unlisted nets `passive`, unrouted `error`
and PDN `ideal`. Corners also accept `minimum` and `maximum`. Extracted PDN is
schema-valid but execution is not implemented. Channel defaults are `prbs7`,
`0UI` and local probe. Endpoints accept a selector, `{ p, n }`, or `{ pin, model }`
with a shared or per-leg pair model. Arrays mean multiple receivers. There is
no channel cap. Explicit PRBS seeds must be integers in `1..2^n-1`; omitted
seeds use the board-wide sorted-name phase plan in core. Clock and literals
omit source seeds. Quiet requires `low`, `high` or `off`; constant literals
normalize to quiet low/high, with explicit quiet taking precedence.

Models use `<simulation.ibismodel>` and `SimulationIbisModelProps`. Corner is
chosen per block; package parasitics are always included. The old namespace,
flat element names, driver/receiver aliases, mask, strobe, setup/hold, thresholds,
supply, modelValueCorner and includePackageParasitics are removed without
aliases. Results contain waveforms and RLGC only; measurements are derived
outside this API. General transient simulation and voltage probes are unchanged.
