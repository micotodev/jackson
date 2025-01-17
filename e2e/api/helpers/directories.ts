import { expect, type APIRequestContext } from '@playwright/test';

const directoryBase = {
  tenant: 'api-boxyhq',
  product: 'api-saml-jackson',
  name: 'Directory name',
  type: 'okta-scim-v2',
};

export const directoryPayload = {
  ...directoryBase,
  webhook_url: 'https://example.com',
  webhook_secret: 'secret',
};

export const directoryExpected = {
  ...directoryBase,
  id: expect.any(String),
  log_webhook_events: false,
  scim: {
    path: expect.any(String),
    secret: expect.any(String),
    endpoint: expect.any(String),
  },
  webhook: { endpoint: 'https://example.com', secret: 'secret' },
};

export const createDirectory = async (request: APIRequestContext, payload: typeof directoryPayload) => {
  const response = await request.post('/api/v1/directory-sync', {
    data: {
      ...payload,
    },
  });

  expect(response.ok()).toBe(true);
  expect(response.status()).toBe(201);

  const { data } = await response.json();

  return data;
};

export const getDirectory = async (
  request: APIRequestContext,
  { tenant, product }: { tenant: string; product: string }
) => {
  const response = await request.get('/api/v1/directory-sync', {
    params: {
      tenant,
      product,
    },
  });

  expect(response.ok()).toBe(true);
  expect(response.status()).toBe(200);

  const { data } = await response.json();

  return data;
};

export const deleteDirectory = async (request: APIRequestContext, directoryId: string) => {
  const response = await request.delete(`/api/v1/directory-sync/${directoryId}`);

  expect(response.ok()).toBe(true);
  expect(response.status()).toBe(200);
};
