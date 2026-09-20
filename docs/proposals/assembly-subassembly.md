# Proposal: assembly.subassembly and assembly.cadassembly

`assembly.subassembly` is a named mechanical assembly. `assembly.cadassembly`
is an exact alternate spelling: both use the same schema and should resolve to
the same core component. A caller can select either spelling by its `name`.

This PR defines props and a proposed runtime contract. Core registration,
attachment resolution, CAD placement, and cycle detection are follow-up work.
Existing `assembly.screen` only resolves PCB targets today; targeting a generic
assembly requires that follow-up too.

```tsx
<assembly.device name="instrument">
  <assembly.subassembly name="housing" cadModel={{ glbUrl: "./housing.glb" }} />
  <assembly.cadassembly name="bracket" connectsTo=".housing">
    <cadmodel modelUrl="./bracket.glb" />
  </assembly.cadassembly>
  <assembly.subassembly name="display-module" connectsTo=".bracket">
    <assembly.screen
      name="screen"
      connectsTo=".displayConnector"
      width="26.7mm"
      height="19.26mm"
    />
    {/* The displayConnector is declared elsewhere in this device. */}
  </assembly.subassembly>
</assembly.device>
```

## Props contract

- `name` is required and must contain non-whitespace characters. It is the stable
  selector identity; `displayName` is an optional human-facing alternate.
- `connectsTo` is an optional nonempty selector. It expresses attachment to an
  existing object, not geometry instancing or electrical connectivity. Selectors
  and names are preserved verbatim. Forward references are valid props.
- `cadModel` uses the existing `CadModelProp` formats: modelprinter strings,
  CAD URL objects, JSX, JSCAD, or null. It is optional, and may coexist with children.
- `children` are passed through untouched, following the existing CAD-container
  convention. A name-only container is valid.
- No placement, model, attachment target, or child defaults are synthesized.
  Nested CAD-model objects retain their existing parser behavior.
- Both tag spellings and their exported input/interface types are equivalent.
  There are no competing alias fields, so no alias precedence or conflict exists.
  Core should normalize both tag names to `AssemblySubassembly`.

## Proposed reference resolution in core

Resolve `connectsTo` in the nearest enclosing `assembly.device`, falling back to
the circuit root when there is no device. Use the complete assembly tree so a
target may be a connector, screen, subassembly, or cadassembly regardless of
declaration order. Duplicate names in separate devices stay isolated. Require
exactly one target and report missing or ambiguous matches.

Each assembly has one attachment target. Either spelling can reference either
spelling, and screens can participate in the same attachment graph. Reject
self-references and attachment cycles, including cycles formed through parent
placement: they do not define an independent anchor. This graph validation
belongs in core, not the individual props parser.

A child assembly inherits its enclosing assembly's frame when it has no explicit
target. An explicit target supplies the attachment frame instead; do not apply
the parent transform twice. A connector supplies its final cable insertion frame;
an assembly target supplies its resolved CAD origin and orientation. Positions
are millimetres in a right-handed frame, +X right, +Y top, +Z above the board.
Use the same transform pipeline for both spellings. This proposal does not add
offsets or a second geometry-reuse reference prop.

## Compatibility

This is additive. The unnamespaced `<cadassembly>` and its `CadAssemblyProps` /
`cadassemblyProps` exports remain unchanged, including `originalLayer`. They are
not silently reinterpreted as this new product-level assembly API. Existing
`assembly.device` and `assembly.screen` validation also remains unchanged.
There is no required migration. Users adopting either new tag need core support
in addition to these props.
