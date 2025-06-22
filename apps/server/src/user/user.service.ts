import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UserWithSecrets } from "@reactive-resume/dto";
import { ErrorMessage } from "@reactive-resume/utils";
import { PrismaService } from "nestjs-prisma";

import { StorageService } from "../storage/storage.service";
import { DoxboxService } from "../doxbox/doxbox.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly doxboxService:DoxboxService
  ) {}

  async findOneById(id: string): Promise<UserWithSecrets> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { secrets: true },
    });

    if (!user.secrets) {
      throw new InternalServerErrorException(ErrorMessage.SecretsNotFound);
    }

    return user;
  }

  async findOneByIdentifier(identifier: string): Promise<UserWithSecrets | null> {
    const user = await (async (identifier: string) => {
      // First, find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: identifier },
        include: { secrets: true },
      });

      // If the user exists, return it
      if (user) return user;

      // Otherwise, find the user by username
      // If the user doesn't exist, throw an error
      return this.prisma.user.findUnique({
        where: { username: identifier },
        include: { secrets: true },
      });
    })(identifier);

    return user;
  }

  async findOneByIdentifierOrThrow(identifier: string): Promise<UserWithSecrets> {
    const user = await (async (identifier: string) => {
      // First, find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: identifier },
        include: { secrets: true },
      });

      // If the user exists, return it
      if (user) return user;


      // Otherwise, find the user by username
      // If the user doesn't exist, throw an error
      return this.prisma.user.findUniqueOrThrow({
        where: { username: identifier },
        include: { secrets: true },
      });
    })(identifier);

    return user;
  }

  create(data: Prisma.UserCreateInput): Promise<UserWithSecrets> {
    return this.prisma.user.create({ data, include: { secrets: true } });
  }

  updateByEmail(email: string, data: Prisma.UserUpdateArgs["data"]): Promise<User> {
    return this.prisma.user.update({ where: { email }, data });
  }

  async updateByResetToken(
    resetToken: string,
    data: Prisma.SecretsUpdateArgs["data"],
    password:string
  ): Promise<void> {
    const objSecret = await this.prisma.secrets.findFirst({ where: { resetToken }});
    const objUser = await this.prisma.user.findFirst({ where: { id:objSecret?.userId }});
    if(objUser){
      await this.doxboxService.resetPassword(objUser.email,password);
      await this.prisma.secrets.update({ where: { resetToken }, data });
    }else{
      throw new InternalServerErrorException("Failed to reset");
    }
  }

  async deleteOneById(id: string): Promise<void> {
    await Promise.all([
      this.storageService.deleteFolder(id),
      this.prisma.user.delete({ where: { id } }),
    ]);
  }

  async addUpdateUserFromDoxbox(data: Prisma.UserCreateInput,globalUserId:string): Promise<User> {
      
      const objUser = await this.prisma.user.findFirst({ where: { globalUserId:globalUserId }});
      if(objUser){
        return await this.prisma.user.update({ where: { id:objUser.id }, data });
      }else{
        data.emailVerified= false;
        return await this.prisma.user.create({ data, include: { secrets: true } });
      }
  }
}
