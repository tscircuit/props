# Assembly bill of materials

Assembly materials accept `purchaseUrls` and `supplierPartNumbers`. These props
apply to `assembly.part`, `fastener`, `bolt`,
`printedpart`, `motor`, `screen`, `cable`, `subassembly` (including its
`cadassembly` alias), and `device`. CAD primitives, reference surfaces, drawings,
and explosion instructions are not material lines.

```tsx
<assembly.device name="sensor">
  <assembly.subassembly name="housing" purchaseUrls={["https://store.example/housing"]}>
    <assembly.part
      name="screws"
      purchaseUrls={["https://amazon.com/dp/example", "https://store.example/m3"]}
    />
    <assembly.part name="module" supplierPartNumbers={{ jlcpcb: ["C123"] }} />
  </assembly.subassembly>
</assembly.device>
```

- `purchaseUrls` accepts arrays of absolute HTTP(S) strings. Omitted and empty
  arrays are valid; URLs are preserved. These are independent alternatives and
  do not correspond positionally to supplier SKUs.
- `supplierPartNumbers` uses the existing supplier-name map and string arrays.
  Arbitrary stores such as Amazon use purchase links instead of a new supplier
  enum value. Omission and an explicitly empty map remain distinct.

There are no aliases, purchase modes, price fields, or conflicts with CAD model
props. Existing assembly inputs remain valid and unchanged when parsed without
BOM props. The new props are assembly-specific; they are not added to all
circuit components. Core emits `cad_assembly_bom_item` records and derives parent
references from TSX nesting. Plain model-less devices stay transparent unless
BOM metadata is supplied. Each material/subassembly element emits a quantity of
one; parentage does not imply that child materials are included in a purchased
parent.
