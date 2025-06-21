import {
  BadRequestException,
  Body,
  Controller,
  Get,
  
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DoxboxService } from "./doxbox.service";

@ApiTags("doxbox")
@Controller("doxbox")
export class DoxboxController {
  constructor(
    private readonly doxboxService:DoxboxService
  ) {}

  @Get('country-list')
  async getList() {
    return this.doxboxService.getCountryList();
  }
  
}
