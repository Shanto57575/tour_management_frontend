import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
  ILogin,
  IRegister,
  ISendOTP,
  IVerifyOTP,
  LoginData,
} from "@/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<null, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
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
        url: "otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogOutMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useUserInfoQuery,
} = authApi;
