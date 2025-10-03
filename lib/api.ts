// Get current environment
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  const rawEnv = (process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development').toLowerCase();
  if (rawEnv.startsWith('prod')) return 'production';
  if (rawEnv.startsWith('test')) return 'test';
  return 'development';
};

// Get API base URL with fallbacks
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();

  if (env === 'production') {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    return 'https://disoriti-be-567480759953.europe-west1.run.app/';
  }

  if (env === 'development') {
    // In development, prefer local API regardless of NEXT_PUBLIC_API_BASE_URL to avoid accidentally hitting production
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_API_BASE_URL &&
      process.env.NEXT_PUBLIC_API_BASE_URL !== 'http://127.0.0.1:8080'
    ) {
      console.warn('Ignoring NEXT_PUBLIC_API_BASE_URL in development. Using http://127.0.0.1:8080');
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL_DEV || 'http://127.0.0.1:8080';
  }

  // test
  return process.env.NEXT_PUBLIC_API_BASE_URL_TEST || 'http://localhost:8000';
};

// Environment configuration
export const ENV = {
  development: {
    API_BASE_URL: getApiBaseUrl(),
    API_VERSION: 'v1',
  },
  production: {
    API_BASE_URL: getApiBaseUrl(),
    API_VERSION: 'v1',
  },
  test: {
    API_BASE_URL: getApiBaseUrl(),
    API_VERSION: 'v1',
  },
} as const;

// Get current API configuration
export const getApiConfig = () => {
  const env = getEnvironment();
  return ENV[env];
};

// Build API URL helper
export const buildApiUrl = (endpoint: string): string => {
  const config = getApiConfig();
  
  // Ensure we have a valid API base URL
  const baseUrl = config.API_BASE_URL || 'http://127.0.0.1:8080';
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${trimmedBase}${path}`;
  
  // Debug logging in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('API URL Debug:', {
      endpoint,
      config,
      baseUrl,
      url,
      environment: getEnvironment()
    });
  }
  
  return url;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete-account',
  },
  
  // Content Generation
  CONTENT: {
    GENERATE_IMAGE: '/ai/generate-image',
    GENERATE_TEXT: '/ai/generate-text',
    ENHANCE_PROMPT: '/ai/enhance-prompt',
    DISORITI_CHAT: '/ai/disoriti-chat',
    SAVE_CONTENT: '/ai/save',
    GET_CONTENT: '/content',
    DELETE_CONTENT: '/content',
    GENERATE_IMAGE_METADATA: '/ai/generate-image-metadata',
  },
  
  // Ad Management
  ADS: {
    CREATE: '/ads/create',
    LIST: '/ads',
    GET: '/ads',
    UPDATE: '/ads',
    DELETE: '/ads',
    PUBLISH: '/ads/publish',
    SCHEDULE: '/ads/schedule',
  },
  
  // Library
  LIBRARY: {
    GET_ALL: '/library',
    GET_BY_ID: '/library',
    SAVE_TO_LIBRARY: '/library/save',
    REMOVE_FROM_LIBRARY: '/library',
    SHARE: '/library/share',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PERFORMANCE: '/analytics/performance',
    REPORTS: '/analytics/reports',
  },
  
  // Settings
  SETTINGS: {
    BRAND: '/settings/brand',
    PREFERENCES: '/settings/preferences',
    INTEGRATIONS: '/settings/integrations',
  },
  
  // Credits/Billing
  BILLING: {
    CREDITS: '/billing/credits',
    SUBSCRIPTION: '/billing/subscription',
    INVOICES: '/billing/invoices',
    PAYMENT_METHODS: '/billing/payment-methods',
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    STATUS: '/subscriptions/status',
    CHECKOUT: '/subscriptions/checkout',
  },
} as const;

// Build full API URLs
export const API_URLS = {
  // Authentication URLs
  LOGIN_URL: buildApiUrl(API_ENDPOINTS.AUTH.LOGIN),
  SIGNUP_URL: buildApiUrl(API_ENDPOINTS.AUTH.SIGNUP),
  REGISTER_URL: buildApiUrl(API_ENDPOINTS.AUTH.REGISTER),
  LOGOUT_URL: buildApiUrl(API_ENDPOINTS.AUTH.LOGOUT),
  REFRESH_URL: buildApiUrl(API_ENDPOINTS.AUTH.REFRESH),
  VERIFY_URL: buildApiUrl(API_ENDPOINTS.AUTH.VERIFY),
  ME_URL: buildApiUrl(API_ENDPOINTS.AUTH.ME),
  FORGOT_PASSWORD_URL: buildApiUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD),
  RESET_PASSWORD_URL: buildApiUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD),
  
  // User URLs
  USER_PROFILE_URL: buildApiUrl(API_ENDPOINTS.USER.PROFILE),
  UPDATE_PROFILE_URL: buildApiUrl(API_ENDPOINTS.USER.UPDATE_PROFILE),
  CHANGE_PASSWORD_URL: buildApiUrl(API_ENDPOINTS.USER.CHANGE_PASSWORD),
  DELETE_ACCOUNT_URL: buildApiUrl(API_ENDPOINTS.USER.DELETE_ACCOUNT),
  
  // Content URLs
  GENERATE_IMAGE_URL: buildApiUrl(API_ENDPOINTS.CONTENT.GENERATE_IMAGE),
  GENERATE_TEXT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.GENERATE_TEXT),
  ENHANCE_PROMPT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.ENHANCE_PROMPT),
  DISORITI_CHAT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.DISORITI_CHAT),
  GENERATE_IMAGE_METADATA_URL: buildApiUrl(API_ENDPOINTS.CONTENT.GENERATE_IMAGE_METADATA),
  SAVE_CONTENT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.SAVE_CONTENT),
  GET_CONTENT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.GET_CONTENT),
  DELETE_CONTENT_URL: buildApiUrl(API_ENDPOINTS.CONTENT.DELETE_CONTENT),
  
  // Ad URLs
  CREATE_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.CREATE),
  LIST_ADS_URL: buildApiUrl(API_ENDPOINTS.ADS.LIST),
  GET_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.GET),
  UPDATE_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.UPDATE),
  DELETE_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.DELETE),
  PUBLISH_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.PUBLISH),
  SCHEDULE_AD_URL: buildApiUrl(API_ENDPOINTS.ADS.SCHEDULE),
  
  // Library URLs
  LIBRARY_URL: buildApiUrl(API_ENDPOINTS.LIBRARY.GET_ALL),
  GET_LIBRARY_ITEM_URL: buildApiUrl(API_ENDPOINTS.LIBRARY.GET_BY_ID),
  SAVE_TO_LIBRARY_URL: buildApiUrl(API_ENDPOINTS.LIBRARY.SAVE_TO_LIBRARY),
  REMOVE_FROM_LIBRARY_URL: buildApiUrl(API_ENDPOINTS.LIBRARY.REMOVE_FROM_LIBRARY),
  SHARE_LIBRARY_URL: buildApiUrl(API_ENDPOINTS.LIBRARY.SHARE),
  
  // Analytics URLs
  ANALYTICS_DASHBOARD_URL: buildApiUrl(API_ENDPOINTS.ANALYTICS.DASHBOARD),
  ANALYTICS_PERFORMANCE_URL: buildApiUrl(API_ENDPOINTS.ANALYTICS.PERFORMANCE),
  ANALYTICS_REPORTS_URL: buildApiUrl(API_ENDPOINTS.ANALYTICS.REPORTS),
  
  // Settings URLs
  BRAND_SETTINGS_URL: buildApiUrl(API_ENDPOINTS.SETTINGS.BRAND),
  PREFERENCES_URL: buildApiUrl(API_ENDPOINTS.SETTINGS.PREFERENCES),
  INTEGRATIONS_URL: buildApiUrl(API_ENDPOINTS.SETTINGS.INTEGRATIONS),
  
  // Billing URLs
  CREDITS_URL: buildApiUrl(API_ENDPOINTS.BILLING.CREDITS),
  SUBSCRIPTION_URL: buildApiUrl(API_ENDPOINTS.BILLING.SUBSCRIPTION),
  INVOICES_URL: buildApiUrl(API_ENDPOINTS.BILLING.INVOICES),
  PAYMENT_METHODS_URL: buildApiUrl(API_ENDPOINTS.BILLING.PAYMENT_METHODS),

  // Subscription URLs
  SUBSCRIPTION_PLANS_URL: buildApiUrl(API_ENDPOINTS.SUBSCRIPTIONS.PLANS),
  SUBSCRIPTION_STATUS_URL: buildApiUrl(API_ENDPOINTS.SUBSCRIPTIONS.STATUS),
  SUBSCRIPTION_CHECKOUT_URL: buildApiUrl(API_ENDPOINTS.SUBSCRIPTIONS.CHECKOUT),
} as const;

// Environment info
export const ENVIRONMENT_INFO = {
  isDevelopment: getEnvironment() === 'development',
  isProduction: getEnvironment() === 'production',
  isTest: getEnvironment() === 'test',
  current: getEnvironment(),
  apiBaseUrl: getApiConfig().API_BASE_URL,
  apiVersion: getApiConfig().API_VERSION,
} as const;

// Helper function to get endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return buildApiUrl(endpoint);
};

// Helper function to get API URL by key
export const getApiUrl = (key: keyof typeof API_URLS): string => {
  return API_URLS[key];
};

// Export for backward compatibility
export const API_LOGIN_URL = API_URLS.LOGIN_URL;
export const API_SIGNUP_URL = API_URLS.SIGNUP_URL;

// Debug: Log environment info (only in browser)
if (typeof window !== 'undefined') {
  console.log('Environment Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    windowLocation: window.location.hostname,
    currentEnv: getEnvironment(),
    apiConfig: getApiConfig(),
    GENERATE_IMAGE_METADATA_URL: API_URLS.GENERATE_IMAGE_METADATA_URL
  });
} 