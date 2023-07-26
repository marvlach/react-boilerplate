/*
We need to disable ESLINT argument mutation rule for these files,
because it clashes with the ability to mutate the state, 
that is provided by RTK 
*/
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { UserProfileType, UserType } from '../types/user';

type UserStateSlice = {
  accessToken: string;
  isAuth: boolean;
  user: UserType | null;
  profile: UserProfileType | null;
  organization: string;
  dates: {
    from: string;
    to: string;
  };
};

const initialState: UserStateSlice = {
  accessToken: '',
  isAuth: false,
  user: null,
  profile: null,
  organization: '',
  dates: {
    from: new Date().toString(),
    to: new Date().toString(),
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state: UserStateSlice) {
      state.isAuth = false;
      state.accessToken = '';
      state.user = null;
      state.profile = null;
      state.organization = '';
      state.dates = {
        from: new Date().toString(),
        to: new Date().toString(),
      };
    },
    setUser(state, { payload }: { payload: UserType }) {
      state.user = payload;
    },
    setUserProfile(state, { payload }: { payload: UserProfileType }) {
      // set user profile
      state.profile = payload;

      // set current organization and dates
      if (payload.organization_groups.length === 0) {
        state.organization = '';
        state.dates = { from: new Date().toString(), to: new Date().toString() };
      }

      // get default org index
      const defaultOrgIndex = payload.organization_groups.findIndex((org) => org.is_default_organization);

      // if no default org: set the first one as default org and today as the date
      if (defaultOrgIndex === -1) {
        state.organization = payload.organization_groups[0].organization_id;
        state.dates = { from: new Date().toString(), to: new Date().toString() };
        return;
      }

      // else set default org as default and the dates from offset
      state.organization = payload.organization_groups[defaultOrgIndex].organization_id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const before = new Date();
      before.setDate(before.getDate() - payload.organization_groups[defaultOrgIndex].display_offset);
      before.setHours(0, 0, 0, 0);
      state.dates = { from: before.toString(), to: today.toString() };
    },
    setUserIsAuth(state, { payload }: { payload: boolean }) {
      state.isAuth = payload;
    },
    login(state, { payload }: { payload: string }) {
      state.accessToken = payload;
    },
    setDateFrom(state, { payload }: { payload: Date }) {
      state.dates.from = payload.toString();
    },
    setDateTo(state, { payload }: { payload: Date }) {
      state.dates.to = payload.toString();
    },
    resetDateToDefaultOfCurrentCompany(state) {
      // if no current org is selected
      if (state.organization === '') {
        state.dates = { from: new Date().toString(), to: new Date().toString() };
        return;
      }

      // reset
      const currentCompanyOffset = state.profile?.organization_groups.find(
        (org) => org.organization_id === state.organization
      )?.display_offset;

      // if it doesn't exist for some reason just do the default
      if (!currentCompanyOffset) {
        state.dates = { from: new Date().toString(), to: new Date().toString() };
        return;
      }

      // reset dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const before = new Date();
      before.setDate(before.getDate() - currentCompanyOffset);
      before.setHours(0, 0, 0, 0);
      state.dates = { from: before.toString(), to: today.toString() };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUser = (state: UserStateSlice) => state.user;
export const getCurrentToken = (state: UserStateSlice) => state.accessToken;
