/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const Verify = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || !confirmed) {
      return;
    }
    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      console.log("timerId");
    }, 1000);

    return () => clearInterval(timerId);
  }, [email, confirmed]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);
    const toastId = toast.loading("Verifying OTP");
    const userInfo = {
      email,
      otp: data.pin,
    };
    try {
      setConfirmed(true);
      const result = await verifyOTP(userInfo).unwrap();
      if (result.success) {
        toast.success(`OTP Verified Successfully`, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.data.message);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSentOtp = async () => {
    setIsSending(true);
    const toastId = toast.loading("Sending OTP");
    try {
      const result = await sendOTP({ email }).unwrap();
      if (result.success) {
        toast.success(`OTP SENT TO ${email}`, { id: toastId });
        setConfirmed(true);
        setTimer(5);
      }
    } catch (error: any) {
      toast.error(error.data.message);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {confirmed ? (
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle>Verify your account</CardTitle>
            <CardDescription>Enter the otp we sent to {email}</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        <Button
                          onClick={handleSentOtp}
                          type="button"
                          variant={"link"}
                          className={cn("p-0 m-0", {
                            "cursor-pointer": timer === 0 && !isSending,
                            "text-gray-400": timer !== 0 || isSending,
                          })}
                          disabled={timer > 0 || isSending}
                        >
                          RESEND OTP :
                        </Button>{" "}
                        {timer}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              form="otp-form"
              type="submit"
              className="w-full cursor-pointer"
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-xs text-center">
          <CardHeader>
            <CardTitle>Verify your Email Address</CardTitle>
            <CardDescription>
              we will send you an OTP at{" "}
              <span className="text-purple-400">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleSentOtp}
              disabled={isSending}
              className="w-full cursor-pointer"
            >
              CONFIRM
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Verify;
