import { baseApi } from "@/redux/baseApi";
import type { IRegister, IUser, UpdateUserPayload } from "@/types/auth.type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<null, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    updateUser: builder.mutation<IUser, UpdateUserPayload>({
      query: ({ userId, userInfo }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    getAllUsers: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query) {
          Object.keys(query).forEach((key) => {
            if (query[key]) {
              params.append(key, query[key]);
            }
          });
        }
        return {
          url: `/user/all-users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useUpdateUserMutation,
  useUserInfoQuery,
  useGetAllUsersQuery,
} = userApi;
