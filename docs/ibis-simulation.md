# IBIS simulation props

These props describe an external simulation. Rendering does not fetch models, install tools, or execute a solver. `executionMode` defaults to the existing native behavior; IBIS pin states require `executionMode="external"`.

- `ibismodel.componentRef` identifies one chip in this subcircuit. `component` is the vendor's IBIS component name. `pinMap` maps vendor pin numbers to that chip's port labels. `modelSelections` chooses a buffer per vendor pin when the model requires it. `references` maps each vendor signal pin's pullup, pulldown, powerClamp, groundClamp, and external reference roles to labels on that chip. No supply rails are inferred.
- `source` is exactly one of `{ url, sha256, archive? }`, `{ file, sha256?, archive? }`, or `{ content, sha256? }`. A URL requires a SHA-256 digest of downloaded bytes. An archive is `{ member, memberSha256? }`, with the optional hash covering extracted bytes. Paths and content are handled by the external runner. Content is not trimmed.
- `corner` (typical, minimum, maximum) and `packagePolicy` (vendor, omit) are required. The runner validates vendor model and package support.
- `analog.transientsimulation.ibisPinStates` maps physical pin selectors to `{ mode: "input" }` or `{ mode: "output", enabled: boolean }`. Models are shared; pin states are per experiment. `spiceEngine` names the engine requested from the runner.
- `analog.digitalstimulus` requires a name, simulationRef, drives pin selector, unitInterval, startTime, initialState, and `{ type: "bits", bits, repeat }` pattern. Bits are a nonempty binary string, specified before inversion. `inverted` defaults to false; all other traffic choices are explicit.
- `analog.eyediagram` requires a name, simulationRef, probeRef, unitInterval, and fixed timeOrigin. Optional startTime/endTime default to the experiment's recording window. Core checks the gate and associations. This is a measurement request with no inferred compliance threshold.

Numeric times use milliseconds; strings accept units such as `"2ns"`. Props use camelCase; core converts them to snake_case Circuit JSON. Existing transient declarations need no migration. Electrical validation, extracted geometry/stackup, tool installation, simulation execution, result CSVs, and HTML viewing belong to the separate local runner.
