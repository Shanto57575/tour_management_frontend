import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2, UploadCloud, MapPin, AlertTriangle } from "lucide-react";

import { useApplyAsGuideMutation, useGetMyApplicationQuery } from "@/redux/features/guide/guide.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema for react-hook-form
const applyGuideSchema = z.object({
    _id: z.string().min(1, "Please select a division where you'd like to guide."),
    nidPhoto: z
        .any()
        .refine((files) => files?.length === 1, "National ID photo is required.")
        .refine(
            (files) => files?.[0]?.size <= 5 * 1024 * 1024, // 5MB limit
            "File size must be less than 5MB."
        )
        .refine(
            (files) =>
                ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only JPG, JPEG, and PNG formats are supported."
        ),
});

type ApplyGuideFormValues = z.infer<typeof applyGuideSchema>;

export default function ApplyGuide() {
    const navigate = useNavigate();
    const [applyAsGuide, { isLoading }] = useApplyAsGuideMutation();
    const { data: divisionsResponse, isLoading: isLoadingDivisions } =
        useGetAllDivisionsQuery(undefined);
    console.log(divisionsResponse)

    const divisions = divisionsResponse?.division || [];
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data: myAppResponse, isLoading: isLoadingMyApp } = useGetMyApplicationQuery(undefined);
    const myApplications = myAppResponse?.data || [];
    const activeApplication = myApplications.find((app: any) => app.status === "PENDING" || app.status === "APPROVED");
    const rejectedApplications = myApplications.filter((app: any) => app.status === "REJECTED");

    const form = useForm<ApplyGuideFormValues>({
        resolver: zodResolver(applyGuideSchema),
        defaultValues: {
            _id: "",
            nidPhoto: undefined,
        },
    });

    const onSubmit = async (data: ApplyGuideFormValues) => {
        const formData = new FormData();
        formData.append("divisionId", data._id);

        // The file list comes from the input type="file"
        if (data.nidPhoto && data.nidPhoto[0]) {
            formData.append("file", data.nidPhoto[0]);
        }

        try {
            const response = await applyAsGuide(formData).unwrap();
            if (response.success) {
                toast.success("Application submitted successfully! We will review your profile.");
                navigate("/user");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit application.");
        }
    };

    const fileRef = form.register("nidPhoto");

    if (isLoadingMyApp) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (activeApplication) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none max-w-3xl mx-auto" />
                <Card className="w-full max-w-lg shadow-xl shadow-purple-500/5 dark:shadow-purple-900/10 border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10 relative">
                    <CardHeader className="text-center space-y-2 pb-6 pt-8">
                        <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 w-16 h-16 rounded-full flex flex-col items-center justify-center mb-2">
                            <MapPin className="text-amber-600 dark:text-amber-400 w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-lato text-slate-900 dark:text-white">
                            Application {activeApplication.status === "PENDING" ? "Under Review" : activeApplication.status}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {activeApplication.status === "PENDING"
                                ? "You have already submitted an application. Please wait for an administrator to review your profile."
                                : "Your application has been approved and you are now a Guide! Head to your dashboard to manage tours."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 md:px-8 pb-8 text-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate(activeApplication.status === "APPROVED" ? "/guide" : "/user")}
                            className="w-full h-12 text-base font-semibold"
                        >
                            {activeApplication.status === "APPROVED" ? "Go to Guide Dashboard" : "Return to Dashboard"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none max-w-3xl mx-auto" />

            <div className="w-full max-w-lg relative z-10 flex flex-col gap-6 pt-16 pb-10">
                {rejectedApplications.length > 0 && (
                    <Card className="border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="pb-3 text-rose-800 dark:text-rose-300">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                <CardTitle className="text-lg">Application Revision Needed</CardTitle>
                            </div>
                            <CardDescription className="text-rose-700 dark:text-rose-400">
                                Please review the feedback from your previous attempts and submit a new application below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {rejectedApplications.map((app: any, idx: number) => (
                                <div key={app._id || idx} className="text-sm bg-white/60 dark:bg-black/20 p-3 rounded-md border border-rose-100 dark:border-rose-800/50">
                                    <span className="font-semibold block mb-1">Feedback:</span>
                                    {app.rejectionReason || "No specific feedback provided."}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card className="w-full shadow-xl shadow-purple-500/5 dark:shadow-purple-900/10 border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm relative">
                    <CardHeader className="text-center space-y-2 pb-6 pt-8">
                        <div className="mx-auto bg-purple-100 dark:bg-purple-900/50 w-16 h-16 rounded-full flex flex-col items-center justify-center mb-2">
                            <MapPin className="text-purple-600 dark:text-purple-400 w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-lato text-slate-900 dark:text-white">
                            Apply to be a Guide
                        </CardTitle>
                        <CardDescription className="text-base">
                            Join TrekOn and start sharing your local expertise with adventurous travelers.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 md:px-8 pb-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* Division Dropdown */}
                                <FormField
                                    control={form.control}
                                    name="_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferred Division</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoadingDivisions}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full border-zinc-200 dark:border-zinc-800 h-12 focus:ring-purple-500">
                                                        <SelectValue placeholder={isLoadingDivisions ? "Loading divisions..." : "Select the division you want to guide in"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {divisions.map((div: any) => (
                                                        <SelectItem key={div._id} value={div._id}>
                                                            {div.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* File Upload for NID */}
                                <FormField
                                    control={form.control}
                                    name="nidPhoto"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>National ID Photo</FormLabel>
                                            <div className="relative group">
                                                <FormControl>
                                                    <div className={`
                          border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center
                          ${form.formState.errors.nidPhoto
                                                            ? 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
                                                            : 'border-zinc-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 bg-zinc-50 dark:bg-zinc-900/50'}
                        `}>
                                                        <UploadCloud className="mx-auto h-10 w-10 text-zinc-400 group-hover:text-purple-500 mb-3 transition-colors" />
                                                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                                            <span className="font-semibold text-purple-600 dark:text-purple-400">Click to upload</span> or drag and drop
                                                        </div>
                                                        <p className="text-xs text-zinc-500">
                                                            SVG, PNG, JPG or GIF (max. 5MB)
                                                        </p>
                                                        <Input
                                                            type="file"
                                                            accept="image/jpeg, image/jpg, image/png"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            {...fileRef}
                                                            onChange={(e) => {
                                                                fileRef.onChange(e);
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setPreviewUrl(URL.createObjectURL(file));
                                                                } else {
                                                                    setPreviewUrl(null);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </div>

                                            {/* Image Preview */}
                                            {previewUrl && !form.formState.errors.nidPhoto && (
                                                <div className="mt-4 relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 h-40 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                                    <img src={previewUrl} alt="NID Preview" className="max-h-full object-contain" />
                                                </div>
                                            )}

                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-600/20 rounded-xl cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Submitting Application...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
