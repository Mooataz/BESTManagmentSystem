import { describe, it, expect } from 'vitest';
import { API } from './api';

describe('API integration', () => {
  it('should have full Axios instance configuration', () => {
    expect(API.defaults).toMatchObject({
      withCredentials: true,
    });

    expect(typeof API.defaults.baseURL).toBe('string');
    expect(API.defaults.baseURL).toMatch(/\/$/);
  });

  it('should have request and response interceptors', () => {
    expect(API.interceptors.request).toBeDefined();
    expect(API.interceptors.response).toBeDefined();
  });
});
