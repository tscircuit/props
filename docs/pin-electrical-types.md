# Pin electrical types

Use `pinAttributes[pin].electricalType` to describe a pin's electrical role:

```tsx
<chip
  name="U1"
  pinAttributes={{
    pin1: { electricalType: "input" },
    pin2: { electricalType: "tri_state" },
    pin3: { electricalType: "open_collector" },
    pin4: { electricalType: "power_input", requiresPower: true },
  }}
/>
```

The optional `PinElectricalType` enum represents every classification in the
[KiCad pin conflicts map](https://docs.kicad.org/master/en/eeschema/eeschema.html#erc_configuration):

| Pin type | `electricalType` |
| --- | --- |
| Input | `"input"` |
| Output | `"output"` |
| Bidirectional | `"bidirectional"` |
| Tri-state | `"tri_state"` |
| Passive | `"passive"` |
| Free | `"free"` |
| Unspecified | `"unspecified"` |
| Power input | `"power_input"` |
| Power output | `"power_output"` |
| Open collector | `"open_collector"` |
| Open emitter | `"open_emitter"` |

Values parse unchanged. There are no aliases or defaults: an omitted field stays
unset, whereas `"unspecified"` explicitly records an unknown electrical type.
`"free"` describes a connectable pin with no electrical function; it is distinct
from a passive terminal and from `doNotConnect: true`.

Existing attributes remain valid and independent. Continue supplying
`requiresPower`, `providesPower`, drive-mode flags, and connection requirements
for consumers that use them. The enum neither populates nor overrides those
fields, and parsing does not validate contradictions between them. Open-collector
and open-emitter classifications are not aliases for the existing open-drain
configuration flags. No migration is required.

This package validates and types the metadata only. Propagation into Circuit JSON
and electrical rules checking, including pairwise conflict severities, require
downstream support; declaring a type does not enable those checks by itself.
