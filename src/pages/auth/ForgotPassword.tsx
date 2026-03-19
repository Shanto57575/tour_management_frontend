import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
});

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        try {
            const result = await forgotPassword(data).unwrap();
            if (result?.success) {
                toast.success("Password reset link sent! Please check your email.");
                navigate("/login");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden bg-purple-100 dark:bg-zinc-950">
            <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold font-merriweather text-slate-900 dark:text-white">
                            Forgot Your Password?
                        </h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="space-y-4 shadow shadow-white dark:shadow-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl px-8 py-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="john@doe.company.com"
                                                    type="email"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white transition-colors" disabled={isLoading}>
                                    {isLoading ? (
                                        <LoaderCircleIcon
                                            className="-ms-1 animate-spin"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="text-center text-sm">
                        Remembered your password?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
                            Back to Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
