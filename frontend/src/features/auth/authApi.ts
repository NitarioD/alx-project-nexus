import { baseApi } from '../../app/api/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AdminSignupResponse {
  username: string;
  password: string;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    adminSignup: builder.mutation<AdminSignupResponse, void>({
      query: () => ({
        url: 'auth/admin/signup/',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useAdminSignupMutation } = authApi;

