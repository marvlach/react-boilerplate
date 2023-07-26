import { z } from 'zod';

export const zodUserType = z.object({
  username: z.string(),
  email: z.string(),
  is_email_verified: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  password: z.null(),
});

export const zodOrganizationConfigurationSchemaType = z.object({
  document_configuration: z.boolean(),
  gl_account_configuration: z.boolean(),
  partner_configuration: z.boolean(),
});

export const zodOrganizationType = z.object({
  configuration_schema: zodOrganizationConfigurationSchemaType,
  display_offset: z.number(),
  is_default_organization: z.boolean(),
  name: z.string(),
  organization_id: z.string(),
});

export const zodResLogin = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  organization_groups: zodOrganizationType.array(),
  scope: z.string(),
  token_type: z.string(),
  user: zodUserType,
});

export const zodUserProfileType = z.object({
  organization_groups: zodOrganizationType.array(),
});
