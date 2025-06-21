import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "@reactive-resume/dto";
import axios from 'axios';

@Injectable()
export class DoxboxService {
  constructor(
    private readonly configService: ConfigService,

  ) {}

  async registerUserInDoxbox(body:RegisterDto): Promise<any> {
    const data = {
      first_name: body.fname,
      middle_name: body.mname ?? "",
      last_name: body.lname ?? "",
      email: body.email,
      dob:this.formatDateDMY(body.dob),
      password: body.password,
      c_password: body.password,
      address: body.cityresidence,
      gender: body.gender,
      residence_address: body.residentaladdress,
      mobile: body.mobile,
      image: "",
      country_code: body.countryCode,
      country: body.countryresidence,
      nationality: body.nationality,
      device_token: "xyz",
      isCraftProfileReq:1
    };

    const config = {
      method: 'post',
      url: `${this.configService.get("DOXBOXURL")}/register`,
      data
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

   formatDateDMY(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate(); // 1–31
    const month = date.getMonth() + 1; // 0–11, so add 1
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  
  
}
