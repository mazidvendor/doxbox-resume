import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Patch,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateUserDto, UserDto } from "@reactive-resume/dto";
import { ErrorMessage } from "@reactive-resume/utils";
import type { Response } from "express";

import { AuthService } from "../auth/auth.service";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "./decorators/user.decorator";
import { UserService } from "./user.service";
import { DoxboxService } from "../doxbox/doxbox.service";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly doxboxService: DoxboxService,
  ) {}

  @Get("me")
  @UseGuards(TwoFactorGuard)
  fetch(@User() user: UserDto) {
    return user;
  }

  @Patch("me")
  @UseGuards(TwoFactorGuard)
  async update(@User("email") email: string,@User("globalUserId") globalUserId: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      // If user is updating their email, send a verification email
      if (updateUserDto.email && updateUserDto.email !== email) {
        await this.userService.updateByEmail(email, {
          emailVerified: false,
          email: updateUserDto.email,
        });

        await this.authService.sendVerificationEmail(updateUserDto.email);

        email = updateUserDto.email;
      }

      await this.doxboxService.updateDoxboxProfile({...updateUserDto,...{user_id:globalUserId}});

      return await this.userService.updateByEmail(email, {
        fname: updateUserDto.fname,
        picture: updateUserDto.picture,
        username: updateUserDto.username,
        locale: updateUserDto.locale,
        mname: updateUserDto.mname,
        lname: updateUserDto.lname,
        gender: updateUserDto.gender,
        dob: updateUserDto.dob,
        nationality: updateUserDto.nationality,
        countryresidence: updateUserDto.countryresidence,
        cityresidence: updateUserDto.cityresidence,
        residentaladdress: updateUserDto.residentaladdress,
        mobile: updateUserDto.mobile,
        countryCode: updateUserDto.countryCode,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete("me")
  @UseGuards(TwoFactorGuard)
  async delete(@User("id") id: string, @Res({ passthrough: true }) response: Response) {
    await this.userService.deleteOneById(id);

    response.clearCookie("Authentication");
    response.clearCookie("Refresh");

    response.status(200).send({ message: "Sorry to see you go, goodbye!" });
  }
}
