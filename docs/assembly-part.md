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
