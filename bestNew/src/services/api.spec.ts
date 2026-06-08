import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { API, API_BASE_URL } from './api';

describe('api config', () => {
  it('API_BASE_URL should be defined', () => {
    expect(API_BASE_URL).toBeDefined();
  });

  it('API_BASE_URL should not have trailing slash', () => {
    expect(API_BASE_URL).not.toMatch(/\/$/);
  });

  it('API should be an Axios instance', () => {
    expect(API.defaults).toBeDefined();
    expect(API.interceptors.request).toBeDefined();
    expect(API.interceptors.response).toBeDefined();
  });

  it('API.defaults.withCredentials should be true', () => {
    expect(API.defaults.withCredentials).toBe(true);
  });

  it('API.defaults.baseURL should end with slash', () => {
    expect(API.defaults.baseURL).toMatch(/\/$/);
  });
});
