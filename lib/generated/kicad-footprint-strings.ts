import { kicadFootprintKeys } from "./kicad-autocomplete"
import type { KicadPath } from "./kicad-autocomplete"

export const kicadFootprintStrings = Object.fromEntries(
  kicadFootprintKeys.map((key) => [key, `kicad:${key}`]),
) as Record<KicadPath, `kicad:${KicadPath}`>
