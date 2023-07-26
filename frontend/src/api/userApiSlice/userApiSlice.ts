import { z } from 'zod';
import apiSlice from '../apiSlice';
import { zodResLogin, zodUserProfileType, zodUserType } from './userApiSlice.zod';

// request params, request body, response body only types
export type ResBodyGetCurrentUser = z.infer<typeof zodUserType>;
export type ResBodyLogin = z.infer<typeof zodResLogin>;
export type ResBodyGetUserProfile = z.infer<typeof zodUserProfileType>;

export const userApiSlice = apiSlice.enhanceEndpoints({ addTagTypes: ['User', 'UserProfile'] }).injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ResBodyLogin, URLSearchParams>({
      query: (body) => {
        return {
          url: '/authorization/access_token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
          formData: true,
        };
      },
      extraOptions: {
        resBodySchema: zodResLogin,
      },
    }),
    getUser: builder.query<ResBodyGetCurrentUser, void>({
      query: () => ({
        url: '/users/current',
        method: 'GET',
      }),
      providesTags: ['User'],
      extraOptions: {
        resBodySchema: zodUserType,
      },
    }),
    getUserProfile: builder.query<ResBodyGetUserProfile, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
      extraOptions: {
        resBodySchema: zodUserProfileType,
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useLazyGetUserProfileQuery,
  useGetUserProfileQuery,
} = userApiSlice;
