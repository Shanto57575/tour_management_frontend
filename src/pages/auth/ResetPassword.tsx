import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Password } from "@/components/ui/Password";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, AlertTriangleIcon } from "lucide-react";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const id = searchParams.get("id");
    const token = searchParams.get("token");

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        if (!id || !token) {
            toast.error("Invalid reset link. Please request a new one.");
            return;
        }

        try {
            const result = await resetPassword({
                id,
                password: data.password,
                token
            }).unwrap();

            if (result?.success) {
                toast.success("Password updated successfully! You can now log in.");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password. The link may have expired.");
        }
    };

    if (!id || !token) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950">
                <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow">
                    <AlertTriangleIcon className="w-12 h-12 text-rose-500 mx-auto" />
                    <h2 className="text-xl font-bold font-lato">Invalid Reset Link</h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm">
                        This password reset link is missing required parameters or is invalid. Please request a new link.
                    </p>
                    <Link to="/forgot-password">
                        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Go to Forgot Password</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden bg-slate-50 dark:bg-zinc-950">
            <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold font-lato text-slate-900 dark:text-white">
                            Set New Password
                        </h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Please enter your new password below. Ensure it is at least 8 characters long.
                        </p>
                    </div>

                    <div className="space-y-4 shadow shadow-white dark:shadow-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl px-8 py-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Password {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Password {...field} value={field.value || ""} />
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
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
