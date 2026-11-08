# Signal integrity props

`signalIntegrityProps` / `SignalIntegrityProps` and `signalProps` / `SignalProps`
validate the authoring API in [RFC #28](https://github.com/tscircuit/rfc/pull/28)
(contract at `ae2c01a336534386886bfe6d3bb916c18c0c445b`):

```tsx
<signalintegrity bitRate="20Mbps">
  <signal name="DATA" driver=".TX > .Y" receiver=".RX > .A" />
</signalintegrity>
```

Props exports and generated component lists live in this package. Core owns
intrinsic element registration, selector resolution, topology diagnostics and
Circuit JSON emission. These schemas alone do not render or simulate a board.

Bit rates normalize to numeric bit/s (`20Mbps` = 20,000,000; `250kbps` = 250,000).
Raw numeric times and parsed time strings are seconds, and mask voltages are
volts. Time strings accept s, ms, us/µs/μs, ns, ps and fs. Voltage strings accept
V, mV and uV/µV/μV. Units must match their quantity.
`duration="32UI"` resolves at the block bit rate. UI offsets remain normalized
strings such as `0.25UI` until core resolves the signal's own or inherited rate.

Block defaults are corner `typ`, unlisted nets `passive`, unrouted `error` and
PDN `ideal`, with rails from the selected IBIS models at the test corner.
PDN `extracted` is accepted by the schema but not implemented yet. Duration stays
absent, including when explicitly `undefined`; the pipeline chooses automatic
recording time from the joint pattern period, settling, offsets and complete eye
windows. A supplied duration is a finite, positive explicit bound in seconds,
including after UI conversion; it cannot be extended by the pipeline.
Signal defaults are pattern `prbs7`, offset `0UI`, probe `local` and mask `ibis`.
An omitted bit rate inherits the block rate. Omitted seeds stay absent for core
to resolve using evenly spaced PRBS phases by sorted signal name across all
board blocks, including quiet PRBS signals. Explicit PRBS seeds must be integers
in `1..2^n-1`: `1..127`, `1..32767` or `1..2147483647` for `prbs7`, `prbs15` or
`prbs31`. The schema checks the selected pattern, including default `prbs7`,
without coercion. Clock and literal patterns do not use seeds; core omits them
from their source records.

Endpoints are pin selectors, `{ p, n }` differential pairs, or
`{ pin: selector, model?: string }` and
`{ pin: { p, n }, model?: string | { p: string, n: string } }` model overrides.
A pair's string override selects both legs; its object override selects each
leg independently. Arrays always mean multiple receivers and cannot be drivers
or the `pin` of a model override. There is no lane count limit. Quiet signals
require an explicit `low`, `high` or `off` level. Core normalizes constant literal
patterns to quiet low/high; an explicit quiet level takes precedence.

Mask objects accept finite signed `vih`/`vil` voltages and finite nonnegative
`setup`/`hold` times (zero is valid). Omitted values use the RFC's corner-adjusted
IBIS DC thresholds; differential thresholds use P−N. The props schema allows
setup/hold without a strobe so core can report the RFC diagnostic:
`mask.setup and mask.hold need a strobe.` Core also validates signal names,
strobe references, IBIS models, connectivity and board requirements. A strobe
names a different switching signal in the same block and must have exactly one
receiver on each data receiver's chip; self-reference and dependency cycles fail.

Migrate SI tests from transient `pcbSpiceChannel` and `ibisPinStates` to
`signalintegrity` with `signal` children. `PcbSpiceChannelProps`,
`pcbSpiceChannelProps`, `IbisPinRunState` and `ibisPinRunState` are removed exports.
IBIS models no longer accept `modelValueCorner` or `includePackageParasitics`:
choose `corner` per SI block; package parasitics are always simulated. These
removed props have no aliases. The `supply` prop is also removed; selected IBIS
model rails replace it. General SPICE transient timing, stimuli, explicit
eye measurements and voltage probes remain available. Built-in SPICE engine
suggestions are `spicey` and `ngspice`; custom engine strings remain supported.
