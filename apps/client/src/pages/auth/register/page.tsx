import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { registerSchema } from "@reactive-resume/dto";
import { usePasswordToggle } from "@reactive-resume/hooks";
import {
  Alert,
  AlertTitle,
  Button,
  DatePicker,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Radio,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type { z } from "zod";

import { useRegister } from "@/client/services/auth";
import { useFeatureFlags } from "@/client/services/feature";
import { Select } from "@radix-ui/react-select";
import PhoneInput, { getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { axios } from "@/client/libs/axios";


type FormValues = z.infer<typeof registerSchema>;
const defaultValues = {
  fname: "",
  mname: "",
  lname: "",
  gender: "",
  dob: "",
  nationality: "",
  countryresidence: "",
  cityresidence: "",
  residentaladdress: "",
  email: "",
  password: "",
  locale: "en-US",
  mobile: "",
  countryCode: "",
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const { register, loading } = useRegister();
  const [mobile, setMobile] = useState(''); // e.g. +919876543210
  const [countryCode, setCountryCode] = useState('');
  const [currentForm, setCurrentForm] = useState('signup');
  const [formData, setFormData] = useState<FormValues>(defaultValues);


  const [countries, setCountries] = useState<any>([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get<any>(
        '/doxbox/country-list'
      );
      setCountries(response.data?.data ?? []);
    } catch (error) {
      console.error('Failed to fetch country list:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);


  const formRef = useRef<HTMLFormElement>(null);
  usePasswordToggle(formRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultValues,
  });


  const onSubmit = async (data: FormValues) => {
    try {
      // await register(data);

      // void navigate("/auth/verify-email");
      setFormData(data);
      setCurrentForm('mobile');
    } catch {
      form.reset();
    }
  };
  const signUpFun = async () => {
    try {
      formData.mobile = mobile;
      formData.countryCode = countryCode;
      await register(formData);
      void navigate("/auth/verify-email");
      setCurrentForm('signup');
    } catch {
      // form.reset();
    }
  };


  return (
    <div className="space-y-8">
      <Helmet>
        <title>
          {t`Create a new account`}  - {t`Reactive Resume`}
        </title>
      </Helmet>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{t`Create a new account`}</h2>
        <h6>
          <span className="opacity-75">{t`Already have an account?`}</span>
          <Button asChild variant="link" className="px-1.5">
            <Link to="/auth/login">
              {t`Sign in now`} <ArrowRight className="ml-1" />
            </Link>
          </Button>
        </h6>
      </div>

      {flags.isSignupsDisabled && (
        <Alert variant="error">
          <AlertTitle>{t`Signups are currently disabled by the administrator.`}</AlertTitle>
        </Alert>
      )}

      <div className={cn(flags.isSignupsDisabled && "pointer-events-none select-none blur-sm")}>
        {currentForm === 'signup' &&
          <Form {...form}>
            <form
              ref={formRef}
              className="flex flex-col gap-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="fname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`First name`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"John Doe"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="mname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Middle Name`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"John Doe"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Last Name`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"John Doe"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Email`}</FormLabel>
                    <FormControl>
                      <Input
                        className="lowercase"
                        placeholder={t({
                          message: "john.doe@example.com",
                          context:
                            "Localized version of a placeholder email. For example, max.mustermann@example.de in German or jan.kowalski@example.pl in Polish.",
                        })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Password`}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      <Trans>
                        Hold <code className="text-xs font-bold">Ctrl</code> to display your password
                        temporarily.
                      </Trans>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Gender`}</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        {["Male", "Female"].map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <Radio
                              value={option}
                              checked={field.value === option}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                            <span className="capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Date of Birth`}</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        value={field.value ?? ""}
                        placeholder="YYYY-MM-DD"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field?.value?.trim() ?? ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem value={country?.country_name?.trim()}>{country?.country_name?.trim()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryresidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Residence</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field?.value?.trim() ?? ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country of Residence" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem value={country?.country_name?.trim()}>{country?.country_name?.trim()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="cityresidence"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`City of Residence`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"City of Residence"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="residentaladdress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Residental Address`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"Residental Address"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={loading} className="mt-4 w-full">
                {t`Sign up`}
              </Button>
            </form>
          </Form>
        }

        {currentForm === 'mobile' &&
          (<><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60">{"Confirm Mobile"}</label><PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="AE"
            onChange={(value) => {
              const phoneDetails = value ? parsePhoneNumber(value) : null;
              const dialCode = phoneDetails?.countryCallingCode || '';
              const nationalNumber = phoneDetails?.nationalNumber || '';
              setMobile(nationalNumber);
              setCountryCode(dialCode);

            }} /><Button onClick={() => {
              setCurrentForm('otp');
            }} className="mt-4 w-full">
              {`Send`}
            </Button></>)
        }


        {currentForm === 'otp' &&
          <><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60">{"Enter OTP"}</label><Input placeholder="123456" autoComplete="one-time-code" /><Button
            onClick={() => {
              signUpFun();
            }}
            className="mt-4 w-full">
            {`Submit`}
          </Button></>
        }
      </div>

    </div>
  );
};
