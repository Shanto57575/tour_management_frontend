import { baseApi } from "@/redux/baseApi";

export interface IDistrict {
  _id: string;
  name: string;
  division: string;
}

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistrictsByDivision: builder.query<IDistrict[], { division?: string }>({
      query: (params) => ({
        url: "/district",
        method: "GET",
        params,
      }),
      providesTags: ["DISTRICT"],
      transformResponse: (response: { data: IDistrict[] }) => response.data,
    }),
  }),
});

export const { useGetDistrictsByDivisionQuery } = districtApi;
