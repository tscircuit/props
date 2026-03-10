import type { AutocompleteString } from "../common/autocomplete"
export type { KicadPath } from "./kicad-footprint-strings"
import type { KicadPath } from "./kicad-footprint-strings"

export type KicadAutocompleteStringPath =
  AutocompleteString<`kicad:${KicadPath}`>
