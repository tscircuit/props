# assembly.subassembly and assembly.cadassembly

`assembly.subassembly` is a named mechanical container. `assembly.cadassembly`
is an exact alias with the same schema and types.

```tsx
<assembly.device name="instrument">
  <assembly.subassembly name="housing" cadModel={{ glbUrl: "/housing.glb" }}>
    <assembly.cadassembly name="bracket">
      <cadmodel modelUrl="/bracket.glb" />
    </assembly.cadassembly>
  </assembly.subassembly>
</assembly.device>
```

Both tags accept `name`, `displayName`, `cadModel`, and `children`. The stable
`name` is required and cannot be blank; the other fields are optional. CAD models
use the existing `CadModelProp` formats, and children are preserved unchanged.
Both spellings produce identical parsed props. No new defaults are introduced.

Subassemblies group nested geometry and inherit placement from their container.
They do not have `connectsTo`. That prop remains available on `assembly.screen`.
As with other unknown fields in this Zod object, a stale runtime `connectsTo`
field is stripped; TypeScript rejects it. Remove it from subassembly usage and
express containment through nesting.

The unnamespaced `<cadassembly>` and its exports remain unchanged. Core provides
the runtime behavior for the namespaced tags.
