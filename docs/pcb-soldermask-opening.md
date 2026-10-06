# Solder-mask and flex-coverlay openings

`<pcbsoldermaskopening />` defines one continuous aperture in the top or bottom
solder mask (or the equivalent flex coverlay), independently of individual pads.
It exposes existing copper or substrate without adding copper, solder paste,
electrical nets, or a board cutout.

```tsx
<pcbsoldermaskopening
  name="CONTACT_WINDOW"
  shape="rect"
  layer="top"
  pcbX={0}
  pcbY={12}
  width="10mm"
  height="4mm"
/>
```

`shape` and `layer` are required. Rectangles require positive `width` and
`height`; circles require a positive `radius`; polygons require at least three
finite `points` enclosing nonzero area. Dimensions and points accept numbers in
millimeters or unit strings. Shape-specific dimensions cannot be combined.

`pcbX`, `pcbY`, and `pcbRotation` use the ordinary PCB placement conventions.
Rectangles and circles are centered at their placement; polygon points are
local to it, with an implicit closing edge. Polygon points include all placement
and rotation when serialized into Circuit JSON. Rotated rectangles use the
canonical `rotated_rect` Circuit JSON shape. A footprint side flip mirrors the
geometry and swaps the opening's top/bottom face just like its pads.

This is a new primitive, with no migration or aliases. Pad-specific
`solderMaskMargin` properties keep their existing behavior.
