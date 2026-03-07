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
import type { Auth, IUser, ISetPassword, IChangePassword } from "@/types/auth.type";
import { Edit, Lock, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user, isLoading } = useUserInfoQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [setPassword, { isLoading: isSettingPassword }] =
    useSetPasswordMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [logOut] = useLogOutMutation();
  const navigate = useNavigate();

  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const userInfo = user?.data;

  const initials = userInfo?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  const hasCredentials = userInfo?.auths?.some(
    (a: Auth) => a.provider === "credentials"
  );

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
      <div className="w-full max-w-lg">
        <div className="rounded-3xl p-8 shadow-xl border border-white/40 dark:border-white/10">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-28 w-28 ring-4 ring-purple-500/30 shadow-xl">
              <AvatarImage src={userInfo?.picture} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-xl font-bold mt-4">{userInfo?.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userInfo?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Info
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{userInfo?.phone || "No phone added"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{userInfo?.address || "No address added"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </p>
              <p className="font-medium text-lg">
                {new Date(userInfo?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

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
