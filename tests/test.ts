import { bugProps } from "../lib/index"
import { zodToJsonSchema } from "zod-to-json-schema"
import { jsonSchemaToZod, type JsonSchema } from "json-schema-to-zod"
import { toSnakeCase } from "convert-case"
import { z } from "zod"

const bugPropsJS = zodToJsonSchema(
  // z.object({
  //   myThing: z.object({
  //     actualName: z.string(),
  //   }),
  // })
  bugProps
)

// Convert the zod props into json schema, convert every key to
// snake_case, then convert the json schema to a zod type

const jsonSchemaBuiltins = new Set(["anyOf", "properties", "required", "$ref"])

function convertSchemaPropertiesToSnakeCase(schema: any): any {
  const result: any = {}

  for (const key in schema) {
    console.log(key)
    if (schema.hasOwnProperty(key)) {
      // If the key is a JSON schema built-in property, keep it as is

      if (key === "required") {
        result[key] = schema[key].map((k: string) => toSnakeCase(k))
      } else if (key === "anyOf") {
        result[key] = schema[key].map((subSchema: JsonSchema) =>
          convertSchemaPropertiesToSnakeCase(subSchema)
        )
      } else if (key === "properties") {
        // If the key is 'properties', process its sub-properties
        const newProperties: any = {}
        const ogProperties = schema[key]
        for (const subKey in ogProperties) {
          if (ogProperties.hasOwnProperty(subKey)) {
            const snakeCaseKey = toSnakeCase(subKey)
            newProperties[snakeCaseKey] = convertSchemaPropertiesToSnakeCase(
              schema[key][subKey]
            )
          }
        }
        result[key] = newProperties
      } else if (key === "$ref") {
        result[key] = schema[key]
          .split("/")
          .map((s: string) => (jsonSchemaBuiltins.has(s) ? s : toSnakeCase(s)))
          .join("/")
      } else {
        result[key] = schema[key]
      }
    }
  }

  return result
}

const bugPropsSnakeCase = convertSchemaPropertiesToSnakeCase(bugPropsJS)

console.log(jsonSchemaToZod(bugPropsSnakeCase))
