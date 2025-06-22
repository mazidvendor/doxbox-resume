import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RegisterDto, UpdateUserDto } from "@reactive-resume/dto";
import axios from 'axios';
import FormData = require('form-data');
import * as fs from 'fs';

@Injectable()
export class DoxboxService {
  constructor(
    private readonly configService: ConfigService,

  ) { }

  async registerUserInDoxbox(body: RegisterDto): Promise<any> {
    const data = {
      first_name: body.fname,
      middle_name: body.mname ?? "",
      last_name: body.lname ?? "",
      email: body.email,
      dob: this.formatDateDMY(body.dob),
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
      isCraftProfileReq: 1
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


  async loginUser(email: string, password: string): Promise<any> {
    const data = {
      email,
      password,
    };

    const config = {
      method: 'post',
      url: `${this.configService.get("DOXBOXURL")}/auth-login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateDoxboxProfile(payload:UpdateUserDto & { user_id: string }): Promise<any> {
    const formData = new FormData();

    formData.append('cyp_cred', this.configService.get("DOXBOXURL_CRED"));
    formData.append('user_id', payload.user_id);
    formData.append('first_name', payload.fname);
    formData.append('middle_name',payload.mname);
    formData.append('last_name', payload.lname);
    formData.append('email', payload.email);
    // formData.append('image', fs.createReadStream(path.resolve('/home/majid/Downloads/icon@2x (1).png')));
    formData.append('residence_address', payload.residentaladdress);
    formData.append('address', payload.cityresidence);
    formData.append('country',payload.countryresidence);
    formData.append('nationality', payload.nationality);
    if(payload.dob){
      formData.append('dob', this.formatDateDMY(payload.dob));
    }
    formData.append('gender',payload.gender);

    try {
      const response = await axios.post(
        `${this.configService.get("DOXBOXURL")}/update-by-cyp`,
        formData,
        {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      if(error?.status==403){
        throw new ForbiddenException('Request failed with status code 403');
      }else{
        throw new Error('Failed to send form data');
      }
    }
  }


  async resetPassword(email: string, password: string): Promise<any> {
    const data = {
      email,
      password,
    };

    const config = {
      method: 'post',
      url: `${this.configService.get("DOXBOXURL")}/reset-password`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('reset failed:', error.response?.data || error.message);
      throw error;
    }
  }


  async getCountryList(): Promise<any> {
    const config = {
      method: 'get',
      url: `${this.configService.get("DOXBOXURL")}/get-country-list`,
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching country list:', error.response?.data || error.message);
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
