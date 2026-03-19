/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface IStatusLog {
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string | null;
  changedBy: string | { _id: string; name?: string; email?: string };
  changedAt?: string;
}

export interface IGuideApplication {
  _id: string;
  user: any;
  profilePhoto: string;
  profilePhotoPublicId?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  alternatePhone?: string;
  presentAddress: string;
  permanentAddress: string;
  nidNumber: string;
  nidFrontPhoto: string;
  nidBackPhoto: string;
  nidFrontPublicId?: string;
  nidBackPublicId?: string;
  division: any;
  district: any;
  operatingAreas?: string[];
  languages: string[];
  experienceYears?: number;
  specializations?: string[];
  bio?: string;
  licenseNumber?: string;
  licensePhoto?: string;
  licensePhotoPublicId?: string;
  licenseVerified?: boolean;
  bankName?: string;
  bankAccountNumber?: string;
  bankBranchName?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt?: string;
  resubmissionCount?: number;
  nidVerified?: boolean;
  statusHistory: IStatusLog[];
  createdAt?: string;
  updatedAt?: string;
}

export const guideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyForGuide: builder.mutation<IResponse<IGuideApplication>, FormData>({
      query: (formData) => ({
        url: "/guide/",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["USER", "GUIDE"],
    }),
    getAllApplications: builder.query<
      IResponse<IGuideApplication[]>,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/guide",
        method: "GET",
        params,
      }),
      providesTags: ["GUIDE"],
    }),
    updateApplicationStatus: builder.mutation<
      IResponse<IGuideApplication>,
      { id: string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/guide/${id}/status`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["GUIDE", "USER"],
    }),
    reapplyApplication: builder.mutation<
      IResponse<IGuideApplication>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/guide/${id}/reapply`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["GUIDE", "USER"],
    }),
    getMyApplication: builder.query<IResponse<IGuideApplication[]>, void>({
      query: () => ({
        url: "/guide/my-application",
        method: "GET",
      }),
      providesTags: ["GUIDE"],
    }),
    getSingleApplication: builder.query<IResponse<IGuideApplication>, string>({
      query: (id) => ({
        url: `/guide/${id}`,
        method: "GET",
      }),
      providesTags: ["GUIDE"],
    }),
  }),
});

export const {
  useApplyForGuideMutation,
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useReapplyApplicationMutation,
  useGetMyApplicationQuery,
  useGetSingleApplicationQuery,
} = guideApi;
