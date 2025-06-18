import { idSchema } from "@reactive-resume/schema";
import { dateSchema } from "@reactive-resume/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { secretsSchema } from "../secrets";

export const usernameSchema = z
  .string()
  .min(3)
  .max(255)
  .regex(/^[\w.-]+$/, {
    message: "Usernames can only contain letters, numbers, periods, hyphens, and underscores.",
  })
  .transform((value) => value.toLowerCase());

export const userSchema = z.object({
  id: idSchema,
  // name: z.string().min(1).max(255),
  fname: z.string().min(1).max(255),
  mname: z.literal("").or(z.string().min(1).max(255)),
  lname: z.literal("").or(z.string().min(1).max(255)),
  gender: z.literal("").or(z.string().min(1).max(255)),
  dob: z.literal("").or(z.string().min(1).max(255)),
  nationality: z.literal("").or(z.string().min(1).max(255)),
  countryresidence: z.literal("").or(z.string().min(1).max(255)),
  cityresidence: z.literal("").or(z.string().min(1).max(255)),
  residentaladdress: z.literal("").or(z.string().min(1).max(255)),

  

  picture: z.literal("").or(z.null()).or(z.string().url()),
  username: usernameSchema,
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  locale: z.string().default("en-US"),
  emailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  provider: z.enum(["email", "github", "google", "openid"]).default("email"),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export class UserDto extends createZodDto(userSchema) {}

export const userWithSecretsSchema = userSchema.merge(
  z.object({ secrets: secretsSchema.nullable().default(null) }),
);

export class UserWithSecrets extends createZodDto(userWithSecretsSchema) {}
