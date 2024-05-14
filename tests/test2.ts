import { bugProps } from "../lib/index"
import { zodToJsonSchema } from "zod-to-json-schema"
import { jsonSchemaToZod, type JsonSchema } from "json-schema-to-zod"
import { toSnakeCase } from "convert-case"
import { z } from "zod"
import { zerialize, dezerialize } from "zodex"

// function convertZodSchemaPropertiesToSnakeCase(schema: any): any {

// }
console.log(zerialize(bugProps))
// for (const prop in bugProps.shape) {
//   console.log(prop)
//   console.log(bugProps.shape[prop]._def)
// }
