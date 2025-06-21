import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Check, UploadSimple, Warning } from "@phosphor-icons/react";
import type { UpdateUserDto } from "@reactive-resume/dto";
import { updateUserSchema } from "@reactive-resume/dto";
import {
  Button,
  buttonVariants,
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
  SelectValue,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { UserAvatar } from "@/client/components/user-avatar";
import { useToast } from "@/client/hooks/use-toast";
import { useResendVerificationEmail } from "@/client/services/auth";
import { useUploadImage } from "@/client/services/storage";
import { useUpdateUser, useUser } from "@/client/services/user";
import { Select } from "@radix-ui/react-select";
import { axios } from "@/client/libs/axios";

export const AccountSettings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { updateUser, loading } = useUpdateUser();
  const { uploadImage, loading: isUploading } = useUploadImage();
  const { resendVerificationEmail } = useResendVerificationEmail();

  const inputRef = useRef<HTMLInputElement>(null);



  const [countries, setCountries] = useState<any>([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get<any>(
        '/doxbox/country-list'
      );
      setCountries(response.data?.data??[]);
    } catch (error) {
      console.error('Failed to fetch country list:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      picture: "",
      fname: "",
      mname: "",
      lname: "",
      username: "",
      gender: "",
      dob: "",
      nationality: "",
      countryresidence: "",
      cityresidence: "",
      residentaladdress: "",
      email: "",
      mobile: "",
      countryCode: "",
    },
  });

  useEffect(() => {
    user && onReset();
  }, [user]);

  const onReset = () => {
    if (!user) return;

    form.reset({
      picture: user.picture ?? "",
      fname: user.fname,
      username: user.username,
      mname: user.mname,
      lname: user.lname,
      gender: user.gender,
      dob: user.dob,
      nationality: user.nationality,
      countryresidence: user.countryresidence,
      cityresidence: user.cityresidence,
      residentaladdress: user.residentaladdress,
      mobile: user.mobile,
      countryCode: user.countryCode,
      email: user.email
    });
  };

  const onSubmit = async (data: UpdateUserDto) => {
    if (!user) return;

    // Check if email has changed and display a toast message to confirm the email change
    if (user.email !== data.email) {
      toast({
        variant: "info",
        title: t`Check your email for the confirmation link to update your email address.`,
      });
    }

    await updateUser({
      fname: data.fname,
      email: data.email,
      picture: data.picture,
      username: data.username,
      mname: data.mname,
      lname: data.lname,
      gender: data.gender,
      dob: data.dob,
      nationality: data.nationality,
      countryresidence: data.countryresidence,
      cityresidence: data.cityresidence,
      residentaladdress: data.residentaladdress,
      mobile: data.mobile,
      countryCode: data.countryCode,
    });

    form.reset(data);
  };

  const onSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const response = await uploadImage(file);
      const url = response.data;

      await updateUser({ picture: url });
    }
  };

  const onResendVerificationEmail = async () => {
    const data = await resendVerificationEmail();

    toast({ variant: "success", title: data.message });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold leading-relaxed tracking-tight">{t`Account`}</h3>
        <p className="leading-relaxed opacity-75">
          {t`Here, you can update your account information such as your profile picture, name and username.`}
        </p>
      </div>

      <Form {...form}>
        <form className="grid gap-6 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="picture"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <div className={cn("flex items-end gap-x-4 sm:col-span-2", error && "items-center")}>
                <UserAvatar />

                <FormItem className="flex-1">
                  <FormLabel>{t`Picture`}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {!user.picture && (
                  <>
                    <input ref={inputRef} hidden type="file" onChange={onSelectImage} />

                    <motion.button
                      disabled={isUploading}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
                      onClick={() => inputRef.current?.click()}
                    >
                      <UploadSimple />
                    </motion.button>
                  </>
                )}
              </div>
            )}
          />

          <FormField
            name="fname"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`First Name`}</FormLabel>
                <FormControl>
                  <Input autoComplete="fname" {...field} />
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
                <FormLabel>{t`Middle Name`}</FormLabel>
                <FormControl>
                  <Input autoComplete="mname" {...field} />
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
                <FormLabel>{t`Last Name`}</FormLabel>
                <FormControl>
                  <Input autoComplete="lname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Username`}</FormLabel>
                <FormControl>
                  <Input autoComplete="username" className="lowercase" {...field} />
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
                  <Input type="email" autoComplete="email" className="lowercase" {...field} />
                </FormControl>
                <FormDescription
                  className={cn(
                    "flex items-center gap-x-1.5 font-medium opacity-100",
                    user.emailVerified ? "text-success-accent" : "text-warning-accent",
                  )}
                >
                  {user.emailVerified ? <Check size={12} /> : <Warning size={12} />}
                  {user.emailVerified ? t`Verified` : t`Unverified`}
                  {!user.emailVerified && (
                    <Button
                      variant="link"
                      className="h-auto text-xs"
                      onClick={onResendVerificationEmail}
                    >
                      {t`Resend email confirmation link`}
                    </Button>
                  )}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Gender`}</FormLabel>
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
                <FormLabel>{t`Date of Birth`}</FormLabel>
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
                    {countries.map((country:any) => (
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
                    {countries.map((country:any) => (
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
                <FormLabel>{t`City of Residence`}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t({
                      message: "City of Residence",
                      context:
                        "Localized version of a placeholder City of Residence. For example, Max Mustermann in German or Jan Kowalski in Polish.",
                    })}
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
                <FormLabel>{t`Residental Address`}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t({
                      message: "Residental Address",
                      context:
                        "Localized version of a placeholder Residental Address. For example, Max Mustermann in German or Jan Kowalski in Polish.",
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence presenceAffectsLayout>
            {form.formState.isDirty && (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-2 self-center sm:col-start-2"
              >
                <Button type="submit" disabled={loading}>
                  {t`Save Changes`}
                </Button>
                <Button type="reset" variant="ghost" onClick={onReset}>
                  {t`Discard`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
};
