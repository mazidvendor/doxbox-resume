import { createZodDto } from "nestjs-zod/dto";

import { userSchema } from "./user";

export const updateUserSchema = userSchema.partial().pick({
  fname: true,
  mname: true,
  lname: true,
  gender: true,
  dob: true,
  nationality: true,
  countryresidence: true,
  cityresidence: true,
  residentaladdress: true,
  mobile: true,
  countryCode: true,
  locale: true,
  username: true,
  email: true,
  picture: true,
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
