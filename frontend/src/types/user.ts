import { z } from 'zod';
import { zodUserProfileType, zodUserType } from '../api/userApiSlice/userApiSlice.zod';

export type UserType = z.infer<typeof zodUserType>;
export type UserProfileType = z.infer<typeof zodUserProfileType>;
