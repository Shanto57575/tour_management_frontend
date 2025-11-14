import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
  ILogin,
  ISendOTP,
  IVerifyOTP,
  LoginData,
  ISetPassword,
  IChangePassword,
} from "@/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IResponse<LoginData>, ILogin>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    sendOTP: builder.mutation<IResponse<null>, ISendOTP>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOTP: builder.mutation<IResponse<null>, IVerifyOTP>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    setPassword: builder.mutation<IResponse<null>, ISetPassword>({
      query: (password) => ({
        url: "/auth/set-password",
        method: "POST",
        data: password,
      }),
    }),
    changePassword: builder.mutation<IResponse<null>, IChangePassword>({
      query: ({ oldPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        data: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogOutMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useSetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
