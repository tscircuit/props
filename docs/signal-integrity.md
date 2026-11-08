# Signal integrity props

`signalIntegrityProps` / `SignalIntegrityProps` and `signalProps` / `SignalProps`
validate the authoring API in [RFC #26](https://github.com/tscircuit/rfc/pull/26):

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

Block defaults are corner `typ`, unlisted nets `passive`, unrouted `error`,
PDN `extracted` and supply `board`. Duration stays omitted for core to derive
from the longest pattern plus 16 UI. Signal defaults are pattern `prbs7`, offset
`0UI`, probe `local` and mask `ibis`. An omitted bit rate inherits the block rate;
an omitted seed stays omitted for core to derive from the signal name.

Endpoints are pin selectors, `{ p, n }` differential pairs, or
`{ pin: selectorOrPair, model?: string }`. Arrays always mean multiple receivers
and cannot be drivers or the `pin` of a model override. There is no lane count
limit. Quiet signals require an explicit `low`, `high` or `off` level.

Mask objects accept `vih`, `vil`, `setup` and `hold`. The props schema allows
setup/hold without a strobe so core can report the RFC diagnostic:
`mask.setup and mask.hold need a strobe.` Core also validates signal names,
strobe references, IBIS models, connectivity and board requirements.

Migrate SI tests from transient `pcbSpiceChannel` and `ibisPinStates` to
`signalintegrity` with `signal` children. `PcbSpiceChannelProps`,
`pcbSpiceChannelProps`, `IbisPinRunState` and `ibisPinRunState` are removed exports.
IBIS models no longer accept `modelValueCorner` or `includePackageParasitics`:
choose `corner` per SI block; package parasitics are always simulated. These
removed props have no aliases. General SPICE transient timing, stimuli, explicit
eye measurements and voltage probes remain available. Built-in SPICE engine
suggestions are `spicey` and `ngspice`; custom engine strings remain supported.
