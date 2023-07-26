import type { RestRequest } from 'msw';
import { rest } from 'msw';
import { UserProfileType, UserType } from '../../../types/user';

// Mock Backend Data
const defaultUser: UserType = {
  username: 'admin',
  email: 'info@mydataease.gr',
  is_email_verified: true,
  first_name: 'Admin',
  last_name: 'MydataEase',
  is_active: true,
  created_at: '2022-10-25T08:11:00.547948+00:00',
  updated_at: '2022-10-25T08:11:00.547948+00:00',
  password: null,
};

const defaultUserProfile: UserProfileType = {
  organization_groups: [
    {
      configuration_schema: {
        document_configuration: true,
        gl_account_configuration: true,
        partner_configuration: true,
      },
      display_offset: 7,
      is_default_organization: true,
      name: 'My Data Ease Prod',
      organization_id: '1',
    },
    {
      configuration_schema: {
        document_configuration: true,
        gl_account_configuration: true,
        partner_configuration: true,
      },
      display_offset: 7,
      is_default_organization: false,
      name: 'My Data Ease Dev',
      organization_id: '2',
    },
  ],
};

const defaultToken = {
  ...defaultUserProfile,
  user: defaultUser,
  access_token: 'valid-token',
  expires_in: 9990,
  scope: '',
  token_type: 'bearer',
};

function isAuthorized(req: RestRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization || authorization !== 'Bearer some-active-token') {
    return false;
  }
  return true;
}

// Define handlers that catch the corresponding requests and returns the mock data.
const handlers = [
  rest.get('http://localhost:2233/api/v1/users/current', (req, res, ctx) => {
    if (!isAuthorized(req)) {
      return res(ctx.status(401));
    }
    return res(ctx.status(200), ctx.json(defaultUser));
  }),
  rest.get('http://localhost:2233/api/v1/users/profile', (req, res, ctx) => {
    if (!isAuthorized(req)) {
      return res(ctx.status(401));
    }
    return res(ctx.status(200), ctx.json(defaultUserProfile));
  }),
  rest.post('http://localhost:2233/api/v1/authorization/access_token', async (req, res, ctx) => {
    const buffer = await req.arrayBuffer();
    const reqBody = Object.fromEntries(new URLSearchParams(new TextDecoder().decode(buffer)));
    const { username, password, grant_type: grantType } = reqBody;

    if (
      !username ||
      !password ||
      !grantType ||
      username !== 'correct-username' ||
      password !== 'correct-password' ||
      grantType !== 'password'
    ) {
      return res(ctx.status(401));
    }

    return res(ctx.status(200), ctx.json(defaultToken));
  }),
];

export default handlers;
