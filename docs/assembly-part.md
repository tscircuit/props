# `<assembly.part />`

A part is a generic component of an assembly. Use it for components that do not
need a specialized assembly element, such as a bracket or an enclosure panel.

```tsx
<assembly.part name="bracket" displayName="Mounting bracket" modelUrl="./bracket.step" />
```

The `AssemblyPartProps` and `AssemblyPartPropsInput` types and the
`assemblyPartProps` validator are exported from `@tscircuit/props`. The validator
is also registered as `assemblyProps.part`.

- `name` is required, trimmed, and must be nonempty.
- `displayName` is an optional human-facing name and is preserved as supplied.
- Geometry is optional. Provide at most one of `model`, `modelUrl`, or `cadModel`.
  `model` is a nonempty, trimmed modelprinter/footprinter string. `modelUrl` uses
  the existing URL/asset-import parser and must not be blank. `cadModel` accepts
  the existing component CAD formats, including JSX and explicit `null`.
- No geometry or other defaults are added. Explicit `cadModel={null}` counts as
  a supplied model source and conflicts with `model` or `modelUrl`.

This is an additive API with no aliases or migration required. Existing assembly
elements keep their current behavior.

## Local CAD placement proposal

`cadPosition={{ x, y, z }}` places the part origin in its parent's assembly
frame. `cadRotation={{ x, y, z }}` orients that frame with right-handed Euler
angles; numbers are degrees and strings accept `deg` or `rad`. Positions use
mm numbers or distance strings. Supply all three axes when supplying an object.
Both props stay absent by default, preserving inherited placement.

This frame moves reference surfaces and assembly descendants with the part;
`cadModel.positionOffset` continues to align only its own model. See the
[placement specification](proposals/assembly-local-placement.md) for transform
order, validation, conflicts, migration and required core acceptance cases.
The props contract alone does not implement runtime placement.

## Face mounting proposal

Ordinary parts can declare `mountedTo="BRIDGE.rail"`, `mountFace="base"`,
and optional `mountGap="0.2mm"` using the existing printed-part/motor mounting
contract. Both face names are required together. A mount fixes the full pose
and conflicts with explicit `cadPosition` or `cadRotation`.
See the [face-mounting specification](proposals/assembly-face-mounting.md) for
units, named child surfaces, defaults, compatibility and core acceptance cases.
This proposal validates the authoring contract; generic-part mounting needs
matching core support.
