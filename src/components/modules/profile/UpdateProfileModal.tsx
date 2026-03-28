import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Phone } from "lucide-react";
import { useState, useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { IUser } from "@/types/auth.type";

interface UpdateProfileModalProps {
  open: boolean;
  onClose: () => void;
  userInfo: IUser;
  onSubmit: (data: UpdateProfilePayload) => void;
  isLoading: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  image?: File;
}

interface UpdateFormInputs {
  name: string;
  phone: string;
  address: string;
}

export const UpdateProfileModal = ({
  open,
  onClose,
  userInfo,
  onSubmit,
  isLoading,
}: UpdateProfileModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormInputs>({
    defaultValues: {
      name: userInfo?.name || "",
      phone: userInfo?.phone || "",
      address: userInfo?.address || "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    userInfo.picture as string
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    reset({
      name: userInfo?.name,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
    setImagePreview(userInfo.picture as string);
    setImageFile(null);
  }, [open, userInfo, reset]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: UpdateFormInputs) => {
    const payload: UpdateProfilePayload = {};

    if (data.name !== userInfo.name) payload.name = data.name;
    if (data.phone !== userInfo.phone) payload.phone = data.phone;
    if (data.address !== userInfo.address) payload.address = data.address;

    if (imageFile instanceof File) {
      payload.image = imageFile;
    }

    onSubmit(payload);

    reset();
    setImageFile(null);
    setImagePreview(userInfo.picture as string);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                <AvatarImage src={imagePreview ?? userInfo.picture} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                  {userInfo?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-200">
                <Camera className="h-4 w-4 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <p className="text-xs text-gray-500">
              Click the camera to change your photo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="phone" className="pl-10" {...register("phone")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="address"
                rows={3}
                className="w-full pl-10 pr-3 py-2 border rounded-md resize-none"
                {...register("address")}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
              className="flex-1 cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
