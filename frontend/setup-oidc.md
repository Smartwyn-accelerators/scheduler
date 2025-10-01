# OIDC Setup Instructions for Timesheet Application

## Quick Setup Guide

### 1. Install Dependencies

Since npm might have execution policy issues on Windows, you can install dependencies using:

**Option 1: Use the provided scripts (Recommended)**
```bash
# PowerShell (run as administrator if needed)
.\install-dependencies.ps1

# Or use the batch file
install-dependencies.bat
```

**Option 2: Manual installation**
```bash
# Install required dependencies
npm install @angular/animations@^20.3.0 --save
npm install zone.js@0.15.1 --save
npm install angular-auth-oidc-client@^18.0.0 --save
npm install @auth0/angular-jwt@^5.2.0 --save
```

**Option 3: Use npx (if npm execution is blocked)**
```bash
npx npm install @angular/animations@^20.3.0 --save
npx npm install zone.js@0.15.1 --save
npx npm install angular-auth-oidc-client@^18.0.0 --save
npx npm install @auth0/angular-jwt@^5.2.0 --save
```

**Option 4: Use yarn (if available)**
```bash
yarn add @angular/animations@^20.3.0
yarn add zone.js@0.15.1
yarn add angular-auth-oidc-client@^18.0.0
yarn add @auth0/angular-jwt@^5.2.0
```

### 2. Configure Azure AD

1. **Create App Registration**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Name: "Angular Timesheet App"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: `https://localhost:4200/auth/callback`
   - Click "Register"

2. **Get Configuration Values**:
   - Copy **Application (client) ID**
   - Copy **Directory (tenant) ID**
   - Go to "Certificates & secrets" > "New client secret"
   - Copy the secret value (save it securely)

3. **Configure Permissions**:
   - Go to "API permissions" > "Add a permission"
   - Select "Microsoft Graph" > "Delegated permissions"
   - Add: `openid`, `profile`, `email`, `offline_access`
   - Click "Grant admin consent"

### 3. Update Environment Configuration

Edit `src/environments/environment.ts`:

```typescript
export const authConfig: OpenIdConfiguration = {
  authority: 'https://login.microsoftonline.com/YOUR-TENANT-ID',
  clientId: 'YOUR-CLIENT-ID',
  // ... rest of configuration
};
```

### 4. Configure Backend API

Update the API URL in both environment files:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-backend-api.com'  // Update this
};
```

### 5. Start the Application

```bash
ng serve --ssl --port=4200
```

### 6. Test the Application

1. Navigate to `https://localhost:4200`
2. You should be redirected to the login page
3. Click "Login" to authenticate with Azure AD
4. After successful authentication, you'll be redirected to the home page

## Troubleshooting

### Common Issues

1. **Module not found errors**: Make sure dependencies are installed
2. **CORS errors**: Configure your backend to allow requests from `https://localhost:4200`
3. **Authentication fails**: Verify Azure AD configuration matches your environment files
4. **Redirect issues**: Ensure redirect URLs match exactly in Azure AD

### Backend Requirements

Your backend should have these endpoints:

- `GET /auth/getAuthorizationToken` - Exchange OIDC token for JWT
- `POST /auth/refresh` - Refresh expired JWT token

The backend should:
- Accept the OIDC token in the `Authentication` cookie
- Return a JWT token with user permissions
- Handle token refresh requests

## Next Steps

1. Replace the placeholder logo in `src/assets/images/logo.png`
2. Customize the UI components as needed
3. Add your business logic and additional protected routes
4. Configure production environment settings
5. Set up proper error handling and logging

## Security Notes

- Always use HTTPS in production
- Store sensitive configuration in environment variables
- Implement proper token validation on the backend
- Configure CORS appropriately
- Set up Content Security Policy headers
