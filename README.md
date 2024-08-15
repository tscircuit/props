# @tscircuit/props

This repo contains all the prop definitions and zod parsers for tscircuit builtin components, e.g. `<resistor />`, `<diode />`,
`<capacitor />` etc.

This repo is the source-of-truth for defining the React props, API changes begin here. The focus of the API is on ergonomics for
the user (unlike [tscircuit/soup](https://github.com/tscircuit/soup) which focuses on ergonomics for a renderer)

```ts
import type { ResistorProps, ResistorPropsInput } from "@tscircuit/props"
import { resistorProps } from "@tscircuit/props"

resistorProps.parse({ resistance: "10k" } as ResistorPropsInput)
// { resistance: 10_000 }
```

This module is used in the [builder](https://github.com/tscircuit/builder) as well as the [react-fiber layer](https://github.com/tscircuit/react-fiber)
to keep prop definitions in-sync.

tscircuit has a convention of React code being `camelCase` and internal or backend code being `snake_case`, this library can function
to transition between the two types.

```ts
bugProps.parse({
  portArrangement: {}
})
// { portArrangement: { } }

bug_props_u.parse({
  portArrangement: {}
})
// { port_arrangement: { } }
```
