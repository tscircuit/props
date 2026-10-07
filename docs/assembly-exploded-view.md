# Assembly exploded views

Exploded-view travel is authored directly on each assembly part with two flat
props:

```tsx
<assembly.device name="controller">
  <chip
    name="ENCLOSURE_BASE"
    cadModel={{ glbUrl: "./base.glb" }}
    explodeDirection="below"
    explodeDistance="60mm"
  />
  <chip
    name="USB_CABLE"
    cadModel={{ glbUrl: "./usb-cable.glb" }}
    explodeDirection={{ x: 1, y: -0.35, z: 0 }}
    explodeDistance="48mm"
  />
</assembly.device>
```

Both props must be provided together. `explodeDistance` is the full travel
at 100% explosion and accepts millimeters as a number or a unit string.
There are no aliases or implicit defaults: omit both props to keep a part fixed.

Named directions follow the circuit-world frame: `right`/`left` are ±X,
`top`/`bottom` are ±Y, and `above`/`below` are ±Z. A vector may be used for a
diagonal path. Each name says where the exploded part ends up relative to its
assembled position; it is not a camera or viewport direction. Core normalizes
vectors, so their magnitude does not change the authored distance.

The props may be placed on a component with its own CAD model or on a group to
move all CAD geometry in that subtree as one logical part. Core reports an error
when only one prop is supplied, when the configured component has no CAD
geometry, or when configured parent and child components overlap.
