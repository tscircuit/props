# @tscircuit/props

This repo contains all the prop definitions and zod parsers for tscircuit builtin components, e.g. `<resistor />`, `<diode />`,
`<capacitor />` etc.

This repo is the source-of-truth for defining the React props, API changes begin here. The focus of the API is on ergonomics for
the user (unlike [circuit-json](https://github.com/tscircuit/circuit-json) which focuses on ergonomics for a renderer)

```ts
import type { ResistorProps, ResistorPropsInput } from "@tscircuit/props"
import { resistorProps } from "@tscircuit/props"

resistorProps.parse({ resistance: "10k" } as ResistorPropsInput)
// { resistance: 10_000 }
```
