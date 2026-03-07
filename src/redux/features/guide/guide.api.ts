import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface IGuideApplication {
  _id: string;
  user: any;
  division: any;
  nidPhoto: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  rejectionReason?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const guideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyAsGuide: builder.mutation<IResponse<IGuideApplication>, FormData>({
      query: (formData) => ({
        url: "/guide/apply",
        method: "POST",
        data: formData, // FormData matches directly to body
        headers: {
          // RTK Query handles multipart boundary automatically if Content-Type is unset for FormData
        },
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
      { id: string; status: string; rejectionReason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/guide/${id}/status`,
        method: "PATCH",
        data: body,
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
  }),
});

export const {
  useApplyAsGuideMutation,
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useGetMyApplicationQuery,
} = guideApi;
