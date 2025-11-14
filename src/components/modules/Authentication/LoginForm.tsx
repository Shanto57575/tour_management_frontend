import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Password } from "@/components/ui/Password";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import GoogleLogin from "./GoogleLogin";

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "password must be at least 8 characters long" }),
});

export const LoginForm = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { isLoading: loginLoading }] = useLoginMutation();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await login(data).unwrap();
      console.log(result);

      if (result?.success) {
        toast.success("User logged in successfully");
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error?.data?.message;

      switch (message) {
        case "User does not exist!":
          toast.error("User not found. Please sign up first.");
          break;

        case "User is not verified":
          toast.error("You are not verified. Please verify your email.");
          navigate("/verify", { state: data.email });
          break;

        case "User is BLOCKED":
          toast.error("Your account has been blocked. Contact support.");
          break;

        case "User is INACTIVE":
          toast.error("Your account is inactive. Contact support.");
          break;

        case "user is Deleted":
          toast.error("This user has been deleted.");
          break;

        case "you have authenticated through google login! if you want to login through credentials at first login with google then set a password":
          toast.error("Login using Google first and set a password.");
          break;

        case "Invalid credentials!":
          toast.error("Invalid email or password.");
          break;

        default:
          toast.error("Something went wrong. Please try again.");
          break;
      }

      console.error("Login error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="space-y-4 shadow shadow-white rounded-2xl px-8 py-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@doe.company.com"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer">
              {loginLoading ? (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <GoogleLogin authLoading={loginLoading} />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
};
