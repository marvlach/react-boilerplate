import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ZodSchema } from 'zod';
import { getBaseUrl } from '../store/baseUrlSlice';
import type { Store } from '../store/store';
import { userActions } from '../store/userSlice';
import { getAccessTokenFromLocalStorage } from '../utils/localStorage';

type ZodExtraOptions = {
  reqBodySchema?: ZodSchema;
  reqParamsSchema?: ZodSchema;
  resBodySchema?: ZodSchema;
};
type TBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, ZodExtraOptions, FetchBaseQueryMeta>;

// hack to infer QueryReturnValue in order to treat zod errors as FetchBaseQueryErrors
type InferedQueryReturnValue = Awaited<ReturnType<TBaseQuery>>;

const baseQuery = fetchBaseQuery({
  baseUrl: '', // this will be filled by baseQueryWrapper
  prepareHeaders: (headers, { getState }) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const { accessToken } = (getState() as Store).userSlice;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
      return headers;
    }

    // If we have a token set in local storage, let's assume that we should be passing it.
    const localStorageAccessToken = getAccessTokenFromLocalStorage();
    if (localStorageAccessToken && localStorageAccessToken !== '') {
      headers.set('authorization', `Bearer ${localStorageAccessToken}`);
      return headers;
    }

    return headers;
  },
});

/**
 * Adjust base url based on baseUrlSlice of redux store
 *
 * @param args The base query arguments
 * @param api BaseQueryApi with access to redux store
 * @returns The adjusted base query arguments
 */
const getAdjustedBaseUrl = (args: string | FetchArgs, api: BaseQueryApi): string | FetchArgs => {
  const baseUrl = getBaseUrl((api.getState() as Store).baseUrlSlice);
  const urlEndpoint = typeof args === 'string' ? args : args.url;

  // construct baseUrl from store
  const adjustedUrl = `${baseUrl}${urlEndpoint}`;
  const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl };
  return adjustedArgs;
};

/**
 * Receives object and zod validation schema and returns result of validation
 *
 * @param objectToValidate unknown object to validate.
 * @param zodValidationSchema zod validation schema.
 * @returns result of validation
 */
const zodValidation = (
  objectToValidate: unknown,
  zodValidationSchema: ZodSchema | undefined
): {
  ok: boolean;
  payload?: InferedQueryReturnValue;
} => {
  if (!(objectToValidate && zodValidationSchema)) {
    return { ok: true };
  }

  const validationResult = zodValidationSchema?.safeParse(objectToValidate);

  if (validationResult?.success) {
    return { ok: true };
  }

  const zodError = validationResult?.error;

  // I get autocompletion on the status property, so it should work
  return {
    ok: false,
    payload: {
      error: {
        status: 'CUSTOM_ERROR',
        error: zodError?.toString(),
      },
    } as InferedQueryReturnValue,
  };
};

/**
 * HOF that wraps a base query function with additional functionality
 * Functionalities include:
 * - adjust base url based on baseUrlSlice of redux store
 * - enforce zod validations on request params and body
 * - issue http request
 * - dispatch logout action if error is 401
 * - enforce zod validations on response body
 *
 * @param baseQueryToWrap The base query function to be wrapped.
 * @returns A modified version of the baseQuery with the added functionalities.
 */
const baseQueryWrapper: (baseQueryToWrap: TBaseQuery) => TBaseQuery =
  (baseQueryToWrap: TBaseQuery) => async (args, api, extraOptions) => {
    // adjust base url based on baseUrlSlice of redux store
    const adjustedArgs = getAdjustedBaseUrl(args, api);

    // validate request params
    const reqParams = typeof args === 'string' ? null : args.params;
    const zodReqParamsSchema = extraOptions?.reqParamsSchema;
    const reqParamsValidationResult = zodValidation(reqParams, zodReqParamsSchema);

    if (!reqParamsValidationResult.ok && reqParamsValidationResult.payload) {
      return reqParamsValidationResult.payload;
    }

    // validate request body
    const reqBody = typeof args === 'string' ? null : args.body;
    const zodReqBodySchema = extraOptions?.reqBodySchema;
    const reqBodyValidationResult = zodValidation(reqBody, zodReqBodySchema);

    if (!reqBodyValidationResult.ok && reqBodyValidationResult.payload) {
      return reqBodyValidationResult.payload;
    }

    // issue http request and await
    const response = await baseQueryToWrap(adjustedArgs, api, extraOptions);

    // if unauthorized: logout and return error
    if (response?.error?.status === 401) {
      api.dispatch(userActions.logout());
      return response;
    }

    // return error
    if (response?.error) {
      return response;
    }

    // validate response body
    const resBody = response.data;
    const zodResBodySchema = extraOptions?.resBodySchema;
    const resBodyValidationResult = zodValidation(resBody, zodResBodySchema);

    if (!resBodyValidationResult.ok && resBodyValidationResult.payload) {
      return resBodyValidationResult.payload;
    }

    // happy path return response with data property
    return response;
  };

/*
const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  let result = await baseQueryWithBaseUrl(args, api, extraOptions);
  if (result?.error?.status !== 401) {
    return result;
  }

  console.log('sending refresh token');
  // send refresh token to get new access token
  const refreshResult = await baseQuery('user/refresh', api, extraOptions);

  if (!refreshResult?.data) {
    api.dispatch(userActions.logout());
  }

  // store the new token
  api.dispatch(userActions.login({ token: refreshResult?.data?.token }));

  // retry the original query with new access token
  result = await baseQueryWithBaseUrl(args, api, extraOptions);
  return result;
};
*/

const apiSlice = createApi({
  baseQuery: baseQueryWrapper(baseQuery),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export default apiSlice;
