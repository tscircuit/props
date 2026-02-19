
import { z } from "zod";

export const textureUrlSchema = z.object({
  type: z.literal("url"),
  url: z.string().url(),
  scale: z.number().optional().default(1),
  rotation: z.number().optional().default(0),
});

export const proceduralTextureSchema = z.object({
  type: z.literal("procedural"),
  pattern: z.enum(["noise", "stripes"]),
  // ... other procedural options could go here
});

export const textureSchema = z.union([
  textureUrlSchema,
  proceduralTextureSchema,
]);

export type Texture = z.infer<typeof textureSchema>;
