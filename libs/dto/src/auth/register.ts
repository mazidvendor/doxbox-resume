import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { userSchema } from "../user";

export const registerSchema = userSchema
  .pick({
    fname: true,
    mname: true,
    lname: true,
    gender: true,
    dob: true,
    nationality: true,
    countryresidence: true,
    cityresidence: true,
    residentaladdress: true,
    email: true, 
    // username: true,
     locale: true
  })
  .extend({ password: z.string().min(6) });

export class RegisterDto extends createZodDto(registerSchema) { }
