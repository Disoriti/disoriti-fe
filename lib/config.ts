import { ENVIRONMENT_INFO } from './api';

// Application configuration
export const APP_CONFIG = {
  name: 'Disoriti',
  version: '1.0.0',
  description: 'AI-powered ad generator',
  
  // Environment
  environment: ENVIRONMENT_INFO.current,
  isDevelopment: ENVIRONMENT_INFO.isDevelopment,
  isProduction: ENVIRONMENT_INFO.isProduction,
  isTest: ENVIRONMENT_INFO.isTest,
  
  // API Configuration
  api: {
    baseUrl: ENVIRONMENT_INFO.apiBaseUrl,
    version: ENVIRONMENT_INFO.apiVersion,
    timeout: 30000, // 30 seconds
    retries: 3,
  },
  
  // Authentication
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },
  
  // Features
  features: {
    imageGeneration: true,
    textGeneration: true,
    promptEnhancement: true,
    adLibrary: true,
    analytics: true,
    scheduling: true,
    teamCollaboration: false, // Future feature
  },
  
  // Limits
  limits: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxTextLength: 10000,
    maxPromptsPerDay: 100,
    maxAdsPerUser: 1000,
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: 'disoriti-primary',
      accent: 'disoriti-accent',
      background: 'background',
      foreground: 'foreground',
    },
    animations: {
      enabled: true,
      duration: 300,
    },
    sidebar: {
      collapsedWidth: '3rem',
      expandedWidth: '16rem',
    },
  },
  
  // Social Media Platforms
  platforms: {
    facebook: {
      name: 'Facebook',
      supported: true,
      imageFormats: ['jpg', 'png'],
      maxImageSize: 30 * 1024 * 1024, // 30MB
      aspectRatios: ['1:1', '16:9', '4:5'],
    },
    instagram: {
      name: 'Instagram',
      supported: true,
      imageFormats: ['jpg', 'png'],
      maxImageSize: 8 * 1024 * 1024, // 8MB
      aspectRatios: ['1:1', '4:5', '16:9'],
    },
    twitter: {
      name: 'Twitter',
      supported: true,
      imageFormats: ['jpg', 'png'],
      maxImageSize: 5 * 1024 * 1024, // 5MB
      aspectRatios: ['16:9', '1:1'],
    },
    linkedin: {
      name: 'LinkedIn',
      supported: true,
      imageFormats: ['jpg', 'png'],
      maxImageSize: 5 * 1024 * 1024, // 5MB
      aspectRatios: ['1.91:1', '1:1'],
    },
    tiktok: {
      name: 'TikTok',
      supported: false, // Future feature
      imageFormats: ['jpg', 'png'],
      maxImageSize: 287 * 1024 * 1024, // 287MB
      aspectRatios: ['9:16', '1:1'],
    },
  },
  
  // Error Messages
  errors: {
    network: 'Network error. Please check your connection.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
    rateLimit: 'Too many requests. Please try again later.',
    maintenance: 'System is under maintenance. Please try again later.',
  },
  
  // Success Messages
  success: {
    login: 'Login successful!',
    logout: 'Logged out successfully',
    signup: 'Account created successfully!',
    save: 'Saved successfully!',
    delete: 'Deleted successfully!',
    update: 'Updated successfully!',
    generate: 'Generated successfully!',
  },
  
  // Validation Rules
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.',
    },
    password: {
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
    },
    username: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Username must be 3-30 characters long and contain only letters, numbers, and underscores.',
    },
  },
} as const;

// Helper functions
export const getConfig = () => APP_CONFIG;

export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.features): boolean => {
  return APP_CONFIG.features[feature];
};

export const getPlatformConfig = (platform: keyof typeof APP_CONFIG.platforms) => {
  return APP_CONFIG.platforms[platform];
};

export const getSupportedPlatforms = () => {
  return Object.entries(APP_CONFIG.platforms)
    .filter(([_, config]) => config.supported)
    .map(([key, config]) => ({ key, ...config }));
};

export const getErrorMessage = (type: keyof typeof APP_CONFIG.errors): string => {
  return APP_CONFIG.errors[type];
};

export const getSuccessMessage = (type: keyof typeof APP_CONFIG.success): string => {
  return APP_CONFIG.success[type];
};

// Environment-specific overrides
if (APP_CONFIG.isDevelopment) {
  // Development-specific configurations
  console.log('🚀 Running in development mode');
  console.log('📡 API Base URL:', APP_CONFIG.api.baseUrl);
}

if (APP_CONFIG.isProduction) {
  // Production-specific configurations
  console.log('🚀 Running in production mode');
}

if (APP_CONFIG.isTest) {
  // Test-specific configurations
  console.log('🧪 Running in test mode');
} 