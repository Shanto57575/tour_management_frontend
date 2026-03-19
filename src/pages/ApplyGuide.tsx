import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

import {
  type IGuideApplication,
  useApplyForGuideMutation,
  useGetMyApplicationQuery,
  useReapplyApplicationMutation,
} from "@/redux/features/guide/guide.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  guideFormSchema,
  type GuideFormValues,
  type IDivisionOption,
  type GuideSpecialization,
  specializationOptions,
} from "./guide-application/types";
import {
  parseCsvToArray,
  getRejectedHistoryEntries,
  toSafeTimestamp,
} from "./guide-application/utils";
import { ApplicationStatusCard } from "./guide-application/ApplicationStatusCard";
import { RejectionSidebar } from "./guide-application/RejectionSidebar";
import type { ImageFieldState } from "./guide-application/ImageUploadField";
import { StepPersonalInfo } from "./guide-application/steps/StepPersonalInfo";
import { StepIdentityLocation } from "./guide-application/steps/StepIdentityLocation";
import { StepProfessionalInfo } from "./guide-application/steps/StepProfessionalInfo";
import { StepDocuments } from "./guide-application/steps/StepDocuments";
import { StepPaymentEmergency } from "./guide-application/steps/StepPaymentEmergency";

export default function ApplyGuide() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [existingProfileUrl, setExistingProfileUrl] = useState<string | null>(null);
  const [nidFrontPhoto, setNidFrontPhoto] = useState<File | null>(null);
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
  const [existingNidFrontUrl, setExistingNidFrontUrl] = useState<string | null>(null);
  const [nidBackPhoto, setNidBackPhoto] = useState<File | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
  const [existingNidBackUrl, setExistingNidBackUrl] = useState<string | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [existingLicenseUrl, setExistingLicenseUrl] = useState<string | null>(null);

  const [applyForGuide, { isLoading: isApplying }] = useApplyForGuideMutation();
  const [reapplyApplication, { isLoading: isReapplying }] = useReapplyApplicationMutation();

  const { data: myAppResponse, isLoading: isLoadingMyApp } = useGetMyApplicationQuery(undefined);
  const { data: divisionsResponse, isLoading: isLoadingDivisions } = useGetAllDivisionsQuery(undefined);

  const applications: IGuideApplication[] = myAppResponse?.data || [];
  const activeApplication = applications.find(
    (app) => app.status === "PENDING" || app.status === "APPROVED",
  );
  const rejectedApplications = applications.filter((app) => app.status === "REJECTED");
  const reapplyTarget = rejectedApplications[0];
  const isReapplyMode = Boolean(reapplyTarget);
  const allRejectedHistory = rejectedApplications
    .flatMap((app) => getRejectedHistoryEntries(app))
    .sort((a, b) => toSafeTimestamp(a.changedAt) - toSafeTimestamp(b.changedAt));

  const divisions = divisionsResponse?.division || [];

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideFormSchema) as unknown as Resolver<GuideFormValues>,
    defaultValues: {
      dateOfBirth: "",
      gender: "male",
      phone: "",
      alternatePhone: "",
      presentAddress: "",
      permanentAddress: "",
      nidNumber: "",
      division: "",
      district: "",
      operatingAreas: "",
      languages: "",
      specializations: [],
      bio: "",
      licenseNumber: "",
      bankName: "",
      bankAccountNumber: "",
      bankBranchName: "",
      bkashNumber: "",
      nagadNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
    },
  });

  const selectedDivision = form.watch("division");
  const { data: districts = [], isLoading: isLoadingDistricts } = useGetDistrictsByDivisionQuery(
    { division: selectedDivision },
    { skip: !selectedDivision },
  );

  useEffect(() => {
    if (!reapplyTarget) return;

    form.reset({
      dateOfBirth: reapplyTarget.dateOfBirth?.slice(0, 10) || "",
      gender: reapplyTarget.gender || "male",
      phone: reapplyTarget.phone || "",
      alternatePhone: reapplyTarget.alternatePhone || "",
      presentAddress: reapplyTarget.presentAddress || "",
      permanentAddress: reapplyTarget.permanentAddress || "",
      nidNumber: reapplyTarget.nidNumber || "",
      division: reapplyTarget.division?._id || "",
      district: reapplyTarget.district?._id || "",
      operatingAreas: (reapplyTarget.operatingAreas || []).join(", "),
      languages: (reapplyTarget.languages || []).join(", "),
      experienceYears: reapplyTarget.experienceYears,
      specializations: (reapplyTarget.specializations || []).filter((value): value is GuideSpecialization =>
        specializationOptions.includes(value as GuideSpecialization),
      ),
      bio: reapplyTarget.bio || "",
      licenseNumber: reapplyTarget.licenseNumber || "",
      bankName: reapplyTarget.bankName || "",
      bankAccountNumber: reapplyTarget.bankAccountNumber || "",
      bankBranchName: reapplyTarget.bankBranchName || "",
      bkashNumber: reapplyTarget.bkashNumber || "",
      nagadNumber: reapplyTarget.nagadNumber || "",
      emergencyContactName: reapplyTarget.emergencyContactName || "",
      emergencyContactPhone: reapplyTarget.emergencyContactPhone || "",
      emergencyContactRelation: reapplyTarget.emergencyContactRelation || "",
    });

    // Pre-fill existing photo previews so user can see them and optionally replace.
    setExistingProfileUrl(reapplyTarget.profilePhoto || null);
    setExistingNidFrontUrl(reapplyTarget.nidFrontPhoto || null);
    setExistingNidBackUrl(reapplyTarget.nidBackPhoto || null);
    setExistingLicenseUrl(reapplyTarget.licensePhoto || null);
  }, [form, reapplyTarget]);

  const stepFields = useMemo<(keyof GuideFormValues)[][]>(
    () => [
      ["dateOfBirth", "gender", "phone", "presentAddress", "permanentAddress"],
      ["nidNumber", "division", "district"],
      ["languages"],
      [],
      [],
    ],
    [],
  );

  const isLoading = isApplying || isReapplying;

  const hasRequiredDocuments = () => {
    const hasProfile = Boolean(profilePhoto || existingProfileUrl);
    const hasNidFront = Boolean(nidFrontPhoto || existingNidFrontUrl);
    const hasNidBack = Boolean(nidBackPhoto || existingNidBackUrl);

    return hasProfile && hasNidFront && hasNidBack;
  };

  const handleNext = async () => {
    const isValid = await form.trigger(stepFields[step]);
    if (!isValid) return;

    if (step === 3 && !hasRequiredDocuments()) {
      toast.error("Profile photo, NID front, and NID back are required before continuing");
      return;
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values: GuideFormValues) => {
    // Guard against any accidental submit event before the final step.
    if (step < 4) {
      setStep(4);
      return;
    }

    // Re-validate all required fields before submit for deterministic final gate.
    const requiredStepFields = stepFields.slice(0, 3);
    for (let index = 0; index < requiredStepFields.length; index += 1) {
      const requiredFields = requiredStepFields[index];
      const isStepValid = await form.trigger(requiredFields, {
        shouldFocus: true,
      });
      if (!isStepValid) {
        setStep(index);
        return;
      }
    }

    const languages = parseCsvToArray(values.languages);
    if ((!isReapplyMode || values.languages.trim()) && languages.length === 0) {
      toast.error("At least one language is required");
      return;
    }

    if (!hasRequiredDocuments()) {
      setStep(3);
      toast.error("Please provide all required identity photos before submission");
      return;
    }

    const formData = new FormData();

    formData.append("dateOfBirth", values.dateOfBirth);
    formData.append("gender", values.gender);
    formData.append("phone", values.phone);
    formData.append("presentAddress", values.presentAddress);
    formData.append("permanentAddress", values.permanentAddress);
    formData.append("nidNumber", values.nidNumber);
    formData.append("division", values.division);
    formData.append("district", values.district);

    if (values.alternatePhone?.trim()) formData.append("alternatePhone", values.alternatePhone.trim());
    if (values.operatingAreas?.trim()) {
      formData.append("operatingAreas", JSON.stringify(parseCsvToArray(values.operatingAreas)));
    }

    if (!isReapplyMode || values.languages.trim()) {
      formData.append("languages", JSON.stringify(languages));
    }

    if (typeof values.experienceYears === "number" && !Number.isNaN(values.experienceYears)) {
      formData.append("experienceYears", String(values.experienceYears));
    }

    if (values.specializations?.length) {
      formData.append("specializations", JSON.stringify(values.specializations));
    }

    if (values.bio?.trim()) formData.append("bio", values.bio.trim());
    if (values.licenseNumber?.trim()) formData.append("licenseNumber", values.licenseNumber.trim());
    if (values.bankName?.trim()) formData.append("bankName", values.bankName.trim());
    if (values.bankAccountNumber?.trim()) formData.append("bankAccountNumber", values.bankAccountNumber.trim());
    if (values.bankBranchName?.trim()) formData.append("bankBranchName", values.bankBranchName.trim());
    if (values.bkashNumber?.trim()) formData.append("bkashNumber", values.bkashNumber.trim());
    if (values.nagadNumber?.trim()) formData.append("nagadNumber", values.nagadNumber.trim());
    if (values.emergencyContactName?.trim()) {
      formData.append("emergencyContactName", values.emergencyContactName.trim());
    }
    if (values.emergencyContactPhone?.trim()) {
      formData.append("emergencyContactPhone", values.emergencyContactPhone.trim());
    }
    if (values.emergencyContactRelation?.trim()) {
      formData.append("emergencyContactRelation", values.emergencyContactRelation.trim());
    }

    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (nidFrontPhoto) formData.append("nidFrontPhoto", nidFrontPhoto);
    if (nidBackPhoto) formData.append("nidBackPhoto", nidBackPhoto);
    if (licensePhoto) formData.append("licensePhoto", licensePhoto);

    const toastId = toast.loading(isReapplyMode ? "Submitting reapplication..." : "Submitting application...");

    try {
      if (isReapplyMode && reapplyTarget?._id) {
        await reapplyApplication({ id: reapplyTarget._id, formData }).unwrap();
      } else {
        await applyForGuide(formData).unwrap();
      }

      toast.success(
        isReapplyMode ? "Reapplication submitted successfully" : "Application submitted successfully",
        { id: toastId },
      );
      navigate("/user");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to submit application";
      toast.error(errorMessage, { id: toastId });
    }
  };

  useEffect(() => {
    return () => {
      [profilePreview, nidFrontPreview, nidBackPreview, licensePreview].forEach((preview) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [profilePreview, nidFrontPreview, nidBackPreview, licensePreview]);

  if (isLoadingMyApp) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (activeApplication) {
    return <ApplicationStatusCard activeApplication={activeApplication} />;
  }

  const profileImageState: ImageFieldState = {
    preview: profilePreview,
    existingUrl: existingProfileUrl,
    setFile: setProfilePhoto,
    setPreview: setProfilePreview,
    setExistingUrl: setExistingProfileUrl,
  };
  const nidFrontImageState: ImageFieldState = {
    preview: nidFrontPreview,
    existingUrl: existingNidFrontUrl,
    setFile: setNidFrontPhoto,
    setPreview: setNidFrontPreview,
    setExistingUrl: setExistingNidFrontUrl,
  };
  const nidBackImageState: ImageFieldState = {
    preview: nidBackPreview,
    existingUrl: existingNidBackUrl,
    setFile: setNidBackPhoto,
    setPreview: setNidBackPreview,
    setExistingUrl: setExistingNidBackUrl,
  };
  const licenseImageState: ImageFieldState = {
    preview: licensePreview,
    existingUrl: existingLicenseUrl,
    setFile: setLicensePhoto,
    setPreview: setLicensePreview,
    setExistingUrl: setExistingLicenseUrl,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none max-w-3xl mx-auto" />

      <div className={cn(
        "w-full relative z-10 pt-16 pb-10 flex flex-col gap-6",
        isReapplyMode ? "max-w-5xl lg:grid lg:grid-cols-[320px_1fr] lg:items-start" : "max-w-3xl",
      )}>
        {rejectedApplications.length > 0 && (
          <RejectionSidebar allRejectedHistory={allRejectedHistory} reapplyTarget={reapplyTarget} />
        )}

        <Card className="w-full shadow-xl shadow-purple-500/5 dark:shadow-purple-900/10 border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 pb-6 pt-8">
            <div className="mx-auto bg-purple-100 dark:bg-purple-900/50 w-16 h-16 rounded-full flex flex-col items-center justify-center mb-2">
              <MapPin className="text-purple-600 dark:text-purple-400 w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold font-merriweather text-slate-900 dark:text-white">
              {isReapplyMode ? "Reapply as Guide" : "Apply as Guide"}
            </CardTitle>
            <CardDescription className="text-base">
              Step {step + 1} of 5: complete your application details.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 md:px-8 pb-8">
            <form
              className="space-y-6"
              onKeyDown={(e) => { if (e.key === "Enter" && step < 4) e.preventDefault(); }}
              onSubmit={(e) => e.preventDefault()}
            >
              {step === 0 && <StepPersonalInfo form={form} />}
              {step === 1 && (
                <StepIdentityLocation
                  form={form}
                  divisions={divisions as IDivisionOption[]}
                  districts={districts as { _id: string; name: string }[]}
                  isLoadingDivisions={isLoadingDivisions}
                  isLoadingDistricts={isLoadingDistricts}
                />
              )}
              {step === 2 && <StepProfessionalInfo form={form} />}
              {step === 3 && (
                <StepDocuments
                  form={form}
                  isReapplyMode={isReapplyMode}
                  profileImage={profileImageState}
                  nidFrontImage={nidFrontImageState}
                  nidBackImage={nidBackImageState}
                  licenseImage={licenseImageState}
                />
              )}
              {step === 4 && <StepPaymentEmergency form={form} />}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0 || isLoading}>
                  Back
                </Button>

                {step < 4 ? (
                  <Button type="button" onClick={handleNext} disabled={isLoading}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : isReapplyMode ? (
                      "Submit Reapplication"
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
