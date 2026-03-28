/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangePasswordModal } from "@/components/modules/profile/ChangePasswordModal";
import { SetPasswordModal } from "@/components/modules/profile/SetPasswordModal";
import { UpdateProfileModal } from "@/components/modules/profile/UpdateProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useChangePasswordMutation,
  useSetPasswordMutation,
  useLogOutMutation,
} from "@/redux/features/auth/auth.api";
import {
  useUpdateUserMutation,
  useUserInfoQuery,
} from "@/redux/features/user/user.api";
import { useGetMyGuideProfileQuery } from "@/redux/features/guide/guide.api";
import type { Auth, IUser, ISetPassword, IChangePassword } from "@/types/auth.type";
import { Edit, Lock, MapPin, Phone, User, BadgeCheck, Star, BriefcaseBusiness, MessageCircleMore, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { role } from "@/constants/role";

export default function ProfilePage() {
  const { data: user, isLoading } = useUserInfoQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [setPassword, { isLoading: isSettingPassword }] =
    useSetPasswordMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [logOut] = useLogOutMutation();
  const navigate = useNavigate();
  const userInfo = user?.data;
  const isGuide = userInfo?.role === role.guide;

  const { data: guideProfileResponse, isLoading: isGuideProfileLoading } =
    useGetMyGuideProfileQuery(undefined, {
      skip: !isGuide,
    });


  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }


  const initials = userInfo?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  const hasCredentials = userInfo?.auths?.some(
    (a: Auth) => a.provider === "credentials"
  );

  const guideProfile = guideProfileResponse?.data;
  const guideApplication = guideProfile?.application;

  const formatDate = (value?: string) => {
    if (!value) return "Not provided";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Not provided";
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdateProfile = async (data: Partial<IUser>) => {
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.address) formData.append("address", data.address);

      if (data.image && data.image instanceof File) {
        formData.append("file", data.image);
      }

      const result = await updateUser({
        userId: userInfo._id,
        userInfo: formData,
      }).unwrap();

      console.log(result);

      toast.success("Profile updated successfully!");
      setUpdateProfileOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const handleSetPassword = async (data: ISetPassword) => {
    try {
      const res = await setPassword(data).unwrap();
      if (res?.success) {
        toast.success("Password set successfully!");
        setPasswordModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to set password");
    }
  };

  const handleChangePassword = async (data: IChangePassword) => {
    try {
      const res = await changePassword(data).unwrap();
      if (res?.success) {
        toast.success("Password changed successfully! Logging out...");
        setPasswordModalOpen(false);
        await logOut(undefined).unwrap();
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full ${isGuide ? "max-w-6xl" : "max-w-lg"}`}>
        <div className="rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/40 dark:border-white/10">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-28 w-28 ring-4 ring-purple-500/30 shadow-xl">
              <AvatarImage src={userInfo?.picture} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h1 className="font-bold mt-4 text-xs md:text-sm lg:text-base">{userInfo?.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              {userInfo?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-purple-600" />
                <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Info
                </p>
              </div>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-start gap-2 text-xs md:text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{userInfo?.phone || "No phone added"}</span>
                </div>
                <div className="flex items-start gap-2 text-xs md:text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{userInfo?.address || "No address added"}</span>
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </p>
              <p className="font-medium text-xs md:text-sm lg:text-lg">
                {new Date(userInfo?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {isGuide && (
            <div className="mb-6 rounded-2xl border border-purple-200/80 dark:border-purple-800/70 bg-gradient-to-br from-purple-50/90 to-white dark:from-purple-950/35 dark:to-zinc-900 p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-purple-600 dark:text-purple-300">
                    Guide Profile
                  </p>
                  <h2 className="text-md md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    Professional Guide Summary
                  </h2>
                  <p className="text-xs md:text-sm mt-2 text-zinc-600 dark:text-zinc-300">
                    Combined from your account and approved guide profile.
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${guideProfile?.isActive === false
                    ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
                    : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                    }`}>
                    <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                    {guideProfile?.isActive === false ? "Guide Inactive" : "Guide Active"}
                  </span>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                    {guideApplication?.status || "APPROVED"}
                  </span>
                </div>
              </div>

              {isGuideProfileLoading ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">Loading guide profile...</p>
              ) : !guideProfile ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                  Guide profile data is not available yet.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 md:gap-3 mt-5">
                    <div className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white/80 dark:bg-zinc-950/40 p-1 sm:p-2 md:p-3">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Avg Rating</p>
                      <p className="text-sm md:text-base lg:text-xl font-bold text-zinc-900 dark:text-zinc-100">{Number(guideProfile.avgRating || 0).toFixed(1)}</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white/80 dark:bg-zinc-950/40 p-1 sm:p-2 md:p-3">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><MessageCircleMore className="h-3.5 w-3.5" /> Reviews</p>
                      <p className="text-sm md:text-base lg:text-xl font-bold text-zinc-900 dark:text-zinc-100">{guideProfile.totalReviews ?? 0}</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white/80 dark:bg-zinc-950/40 p-1 sm:p-2 md:p-3">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5" /> Completed Tours</p>
                      <p className="text-sm md:text-base lg:text-xl font-bold text-zinc-900 dark:text-zinc-100">{guideProfile.completedTours ?? 0}</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white/80 dark:bg-zinc-950/40 p-1 sm:p-2 md:p-3">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Response Rate</p>
                      <p className="text-sm md:text-base lg:text-xl font-bold text-zinc-900 dark:text-zinc-100">{guideProfile.responseRate ?? 0}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300 mb-2">Guide Details</p>
                      <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                        <p><span className="text-zinc-500 dark:text-zinc-400">Experience:</span> {guideApplication?.experienceYears ?? 0} years</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Division:</span> {guideApplication?.division?.name || "Not provided"}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">District:</span> {guideApplication?.district?.name || "Not provided"}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Languages:</span> {guideApplication?.languages?.length ? guideApplication.languages.join(", ") : "Not provided"}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Specializations:</span> {guideApplication?.specializations?.length ? guideApplication.specializations.join(", ") : "Not provided"}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300 mb-2">Application and Availability</p>
                      <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                        <p><span className="text-zinc-500 dark:text-zinc-400">Submitted:</span> {formatDate(guideApplication?.submittedAt)}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Last Active:</span> {formatDate(guideProfile.lastActiveAt)}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Availability:</span> {guideProfile.isAvailable ? "Available" : "Unavailable"}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Featured:</span> {guideProfile.isFeatured ? "Yes" : "No"}</p>
                        <p><span className="text-zinc-500 dark:text-zinc-400">Badges:</span> {guideProfile.badges?.length ? guideProfile.badges.join(", ") : "No badges yet"}</p>
                      </div>
                    </div>
                  </div>

                  {guideApplication?.bio && (
                    <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300 mb-2">Bio</p>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{guideApplication.bio}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => setUpdateProfileOpen(true)}
              className="cursor-pointer w-full shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>

            <Button
              onClick={() => setPasswordModalOpen(true)}
              variant="outline"
              className="cursor-pointer w-full border-purple-300 hover:bg-purple-50 dark:border-purple-700"
            >
              <Lock className="h-4 w-4 mr-2" />
              {hasCredentials ? "Change Password" : "Set Password"}
            </Button>
          </div>
        </div>
      </div>

      <UpdateProfileModal
        open={updateProfileOpen}
        onClose={() => setUpdateProfileOpen(false)}
        userInfo={userInfo}
        onSubmit={handleUpdateProfile}
        isLoading={isUpdating}
      />

      {hasCredentials ? (
        <ChangePasswordModal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleChangePassword}
          isLoading={isChangingPassword}
        />
      ) : (
        <SetPasswordModal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleSetPassword}
          isLoading={isSettingPassword}
        />
      )}
    </div>
  );
}
