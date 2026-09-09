# Pin electrical attributes

Use optional boolean attributes to describe each pin's electrical role:

```tsx
<chip
  name="U1"
  pinAttributes={{
    pin1: { isInput: true },
    pin2: { isInput: true, isOutput: true },
    pin3: { isOutput: true, canUseTriState: true, isUsingTriState: true },
    pin4: { requiresPower: true },
  }}
/>
```

The classifications in the KiCad pin conflicts map can be represented as follows:

| Pin type | Attributes |
| --- | --- |
| Input | `isInput: true` |
| Output | `isOutput: true` |
| Bidirectional | `isInput: true, isOutput: true` |
| Tri-state | `isOutput: true, isUsingTriState: true` |
| Passive | `isPassive: true` |
| Free | `isFree: true` |
| Unspecified | `isUnspecified: true` |
| Power input | `requiresPower: true` (existing) |
| Power output | `providesPower: true` (existing) |
| Open collector | `isOutput: true, isUsingOpenCollector: true` |
| Open emitter | `isOutput: true, isUsingOpenEmitter: true` |

`canUseTriState`, `canUseOpenCollector`, and `canUseOpenEmitter` describe supported
modes; the corresponding `isUsing…` flags describe configuration, following the
existing open-drain and push-pull pattern. `isUsingTriState` does not describe
whether the pin is currently in its high-impedance state. Add `isInput: true` when
a tri-state pin also accepts signals.

All new fields accept only booleans and preserve both `true` and `false`. Omitted
fields stay unset; there are no defaults, aliases, inferred attributes, or
cross-field conflict validation. `isUnspecified: true` explicitly records an
unknown role. `isFree: true` describes a connectable pin with no electrical
function, distinct from a passive terminal or `doNotConnect: true`.

Existing attributes remain valid and no migration is required. Power types reuse
`requiresPower` and `providesPower`. Open-collector and open-emitter flags remain
distinct from the existing open-drain flags.

This package validates and types the metadata only. Propagation into Circuit JSON
and electrical rules checking, including pairwise conflict severities, require
downstream support; declaring these attributes does not enable those checks.
