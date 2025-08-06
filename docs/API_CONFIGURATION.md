# API Configuration System

This document explains how to use the centralized API configuration system in the Disoriti application.

## Overview

The API configuration system provides:
- Environment-based API endpoints
- Centralized API URL management
- Type-safe API access
- Easy environment switching

## Files Structure

```
lib/
├── api.ts          # Main API configuration
├── config.ts       # Application configuration
└── links.ts        # Deprecated (for backward compatibility)
```

## Environment Configuration

### Development
- **API Base URL**: `http://127.0.0.1:8000`
- **API Version**: `v1`
- **Full URL Example**: `http://127.0.0.1:8000/api/v1/auth/login`

### Production
- **API Base URL**: `https://api.disoriti.com` (or `NEXT_PUBLIC_API_BASE_URL` env var)
- **API Version**: `v1`
- **Full URL Example**: `https://api.disoriti.com/api/v1/auth/login`

### Test
- **API Base URL**: `http://localhost:8000`
- **API Version**: `v1`
- **Full URL Example**: `http://localhost:8000/api/v1/auth/login`

## Usage Examples

### 1. Using Pre-built API URLs

```typescript
import { API_URLS } from '@/lib/api';

// Authentication
const loginUrl = API_URLS.LOGIN_URL;
const signupUrl = API_URLS.SIGNUP_URL;

// Content Generation
const generateImageUrl = API_URLS.GENERATE_IMAGE_URL;
const enhancePromptUrl = API_URLS.ENHANCE_PROMPT_URL;

// User Management
const userProfileUrl = API_URLS.USER_PROFILE_URL;
const updateProfileUrl = API_URLS.UPDATE_PROFILE_URL;
```

### 2. Using API Endpoints

```typescript
import { API_ENDPOINTS, buildApiUrl } from '@/lib/api';

// Build custom URL
const customUrl = buildApiUrl('/custom/endpoint');

// Use specific endpoints
const loginEndpoint = API_ENDPOINTS.AUTH.LOGIN;
const loginUrl = buildApiUrl(loginEndpoint);
```

### 3. Environment Information

```typescript
import { ENVIRONMENT_INFO } from '@/lib/api';

console.log('Current environment:', ENVIRONMENT_INFO.current);
console.log('Is development:', ENVIRONMENT_INFO.isDevelopment);
console.log('API Base URL:', ENVIRONMENT_INFO.apiBaseUrl);
```

### 4. Making API Requests

```typescript
import { useApi } from '@/hooks/use-api';
import { API_URLS } from '@/lib/api';

const MyComponent = () => {
  const { request, loading, error } = useApi({
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  });

  const handleLogin = async () => {
    const result = await request(API_URLS.LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  };
};
```

### 5. Using Application Configuration

```typescript
import { APP_CONFIG, isFeatureEnabled, getSupportedPlatforms } from '@/lib/config';

// Check if feature is enabled
if (isFeatureEnabled('imageGeneration')) {
  // Show image generation UI
}

// Get supported platforms
const platforms = getSupportedPlatforms();
console.log('Supported platforms:', platforms);

// Get error messages
const errorMessage = APP_CONFIG.errors.network;
```

## API Endpoints Reference

### Authentication
- `LOGIN_URL` - User login
- `SIGNUP_URL` - User registration
- `LOGOUT_URL` - User logout
- `REFRESH_URL` - Token refresh
- `VERIFY_URL` - Email verification
- `FORGOT_PASSWORD_URL` - Password reset request
- `RESET_PASSWORD_URL` - Password reset

### User Management
- `USER_PROFILE_URL` - Get user profile
- `UPDATE_PROFILE_URL` - Update user profile
- `CHANGE_PASSWORD_URL` - Change password
- `DELETE_ACCOUNT_URL` - Delete account

### Content Generation
- `GENERATE_IMAGE_URL` - Generate images
- `GENERATE_TEXT_URL` - Generate text content
- `ENHANCE_PROMPT_URL` - Enhance prompts
- `SAVE_CONTENT_URL` - Save generated content
- `GET_CONTENT_URL` - Get user content
- `DELETE_CONTENT_URL` - Delete content

### Ad Management
- `CREATE_AD_URL` - Create new ad
- `LIST_ADS_URL` - List user ads
- `GET_AD_URL` - Get specific ad
- `UPDATE_AD_URL` - Update ad
- `DELETE_AD_URL` - Delete ad
- `PUBLISH_AD_URL` - Publish ad
- `SCHEDULE_AD_URL` - Schedule ad

### Library
- `LIBRARY_URL` - Get library items
- `GET_LIBRARY_ITEM_URL` - Get specific library item
- `SAVE_TO_LIBRARY_URL` - Save to library
- `REMOVE_FROM_LIBRARY_URL` - Remove from library
- `SHARE_LIBRARY_URL` - Share library item

### Analytics
- `ANALYTICS_DASHBOARD_URL` - Analytics dashboard
- `ANALYTICS_PERFORMANCE_URL` - Performance metrics
- `ANALYTICS_REPORTS_URL` - Analytics reports

### Settings
- `BRAND_SETTINGS_URL` - Brand settings
- `PREFERENCES_URL` - User preferences
- `INTEGRATIONS_URL` - Third-party integrations

### Billing
- `CREDITS_URL` - Credits management
- `SUBSCRIPTION_URL` - Subscription management
- `INVOICES_URL` - Invoice history
- `PAYMENT_METHODS_URL` - Payment methods

## Environment Variables

### Production Environment Variables

Create a `.env.local` file for local development:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.disoriti.com

# Other environment variables
NEXT_PUBLIC_APP_ENV=production
```

### Development Environment Variables

```bash
# API Configuration (optional, defaults to http://127.0.0.1:8000)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Other environment variables
NEXT_PUBLIC_APP_ENV=development
```

## Migration from Old System

If you're using the old `lib/links.ts` system:

### Before
```typescript
import { API_LOGIN_URL } from '@/lib/links';
```

### After
```typescript
import { API_URLS } from '@/lib/api';

// Use API_URLS.LOGIN_URL instead of API_LOGIN_URL
```

## Best Practices

1. **Always use the centralized API configuration** instead of hardcoding URLs
2. **Use the `useApi` hook** for making authenticated requests
3. **Check environment before making requests** in development
4. **Use TypeScript** for better type safety
5. **Handle errors appropriately** using the provided error messages
6. **Test with different environments** to ensure compatibility

## Troubleshooting

### Common Issues

1. **API URL not found**: Make sure you're importing from `@/lib/api`
2. **Environment not detected**: Check `NODE_ENV` environment variable
3. **CORS issues**: Ensure your API server allows requests from your frontend domain
4. **Authentication errors**: Verify that tokens are being sent correctly

### Debug Information

```typescript
import { ENVIRONMENT_INFO, getApiConfig } from '@/lib/api';

console.log('Environment Info:', ENVIRONMENT_INFO);
console.log('API Config:', getApiConfig());
```

This will help you debug environment-related issues. 