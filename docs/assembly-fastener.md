# Assembly bolts and fasteners

`AssemblyFastenerProps` / `assemblyFastenerProps` and `AssemblyBoltProps` /
`assemblyBoltProps` are exported from `@tscircuit/props`. Their schemas are also
available as `assemblyProps.fastener` and `assemblyProps.bolt`.

```tsx
<assembly.fastener
  name="coverClip"
  modelUrl="cover-clip.step"
  fastenedTo="COVER.clipSurface"
/>

<assembly.bolt
  name="coverBolt"
  diameter="3mm"
  length="10mm"
  mountedTo="COVER.boltHole"
/>
```

These are props definitions for downstream TSX integration. This package does not
render geometry, resolve assembly references, or implement disassembly sequencing.

## Shared inputs and canonical output

- `name` is required and trimmed; `displayName` is an optional human-facing name.
- `model`, `modelUrl`, and `cadModel` reuse the assembly part formats and are
  mutually exclusive. Imported asset URL objects normalize to strings. Reference
  surface `children` are preserved. A generic fastener can omit geometry entirely.
- `mountedTo` identifies a qualified reference surface such as `FRAME.boltHole`
  or `DEVICE.FRAME.boltHole`. Each path segment begins with a letter or underscore
  and contains letters, digits, underscores, or hyphens.
- `fastenedTo` is an input alias for `mountedTo`. Trimmed values must agree when
  both are supplied. Parsed output contains only `mountedTo`.
- Both element kinds express a fastening relationship to the mounting target;
  consumers should infer that relationship without another boolean prop.
- `mountFace` optionally names the fastener's own mating surface. Consumers mate
  opposing outward normals with aligned in-plane X directions. When omitted,
  consumers use the model's authored mounting origin. No arbitrary face is selected.
- `mountGap` accepts millimeters as a number or a unit string and parses to finite,
  nonnegative millimeters. Both `mountFace` and `mountGap` require a mounting target.
  An omitted gap stays omitted; consumers use zero clearance.
- Without a mounting target, a fastener remains an unmounted assembly part.
  No mounting or geometry defaults are inserted for generic fasteners.

## Dimensional bolts

Supply either `diameter` and `length`, or one CAD source. CAD sources are exclusive
with `diameter`, `length`, `threadPitch`, and `headType`, including `cadModel={null}`.

Dimensions accept numbers in millimeters or unit strings and parse to finite,
positive millimeters. `diameter` is the nominal thread diameter. `length` excludes
the head except for countersunk bolts, where it includes the head.

`headType` accepts `socket`, `hex`, `pan`, or `countersunk`; dimensional bolts
default to `socket`. Optional `threadPitch` is also a positive distance; no thread
pitch is inferred. Custom CAD bolts receive no dimensional or head defaults.

These are additive APIs. Existing `assembly.part`, `assembly.printedpart`, and
other assembly schemas retain their behavior; no migration is required. When
adopting these schemas, consumers should read the canonical parsed `mountedTo`
field rather than the input alias.
