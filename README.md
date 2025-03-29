## Cursor-Vibe coding

# Insurance Advisor Biometric Verification System

This application demonstrates a secure registration and authentication system for insurance advisors, leveraging facial biometrics and professional credentials verification to prevent fraudulent account access.

## Features

- Multi-factor authentication (credentials + biometrics)
- Facial recognition for identity verification
- SSN and NPN validation
- Secure session management
- Professional credential verification
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- Webcam for facial recognition features

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/biometric-app-registration.git
   cd biometric-app-registration
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Download face-api.js models (required for facial recognition):
   You'll need to download the face-api.js models from https://github.com/justadudewhohacks/face-api.js/tree/master/weights and place them in the `public/models` directory.

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Integrating with ID.me

For production implementation, you should replace the simulated authentication with ID.me's identity verification services:

### Step 1: Register with ID.me Developer Platform

1. Sign up for a developer account at [ID.me Developer Portal](https://developers.id.me/)
2. Create an organization for your company
3. Select the appropriate identity verification policy:
   - For insurance advisors, you'll likely want to use their identity verification with professional credential validation

### Step 2: Configure Your ID.me Application

1. Obtain your API credentials:
   - Client ID
   - Client Secret  
   - Authorization endpoint

2. Configure the redirect URLs for:
   - Authentication success
   - Authentication failure

### Step 3: Implement ID.me OAuth Flow

Replace the current authentication flow with ID.me's OAuth implementation:

1. Update the login component to redirect to ID.me:
   ```javascript
   const redirectToIDme = () => {
     window.location.href = `https://api.id.me/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identity`;
   };
   ```

2. Implement the callback handler to process the authorization code:
   ```javascript
   // On your callback endpoint
   const exchangeCodeForToken = async (code) => {
     const response = await axios.post('https://api.id.me/oauth/token', {
       code,
       client_id: 'YOUR_CLIENT_ID',
       client_secret: 'YOUR_CLIENT_SECRET',
       redirect_uri: 'YOUR_REDIRECT_URI',
       grant_type: 'authorization_code'
     });
     
     // Store the token and user information
     const { access_token } = response.data;
     
     // Fetch user information
     const userResponse = await axios.get('https://api.id.me/api/public/v3/attributes.json', {
       headers: {
         Authorization: `Bearer ${access_token}`
       }
     });
     
     // Process user data
     const userData = userResponse.data;
     
     // Verify if the user is an insurance advisor (this would depend on your ID.me verification policy)
     if (userData.verified && userData.group === 'insurance_advisor') {
       // Proceed with authentication
     }
   };
   ```

### Step 4: Integrate with Your Backend

1. Your backend should validate the ID.me tokens
2. Implement additional verification against your internal database for NPN and license validation
3. Create a session or JWT token for your application

## Security Considerations

- Always use HTTPS in production
- Store sensitive data securely (not in localStorage for production)
- Implement rate limiting to prevent brute force attacks
- Follow ID.me's security guidelines and best practices
- Consider monitoring and alerting for suspicious authentication activities

## Alternatives to ID.me

Other identity verification services that could be considered:

1. Veriff - Provides robust AI-powered identity verification
2. Onfido - Offers document and biometric verification
3. Jumio - Specializes in ID verification and eKYC
4. iDenfy - All-in-one identity verification platform
5. Trulioo - Global identity verification service

## Customizing the Application

This codebase serves as a starting point. For production use:

1. Implement a proper backend service
2. Use a secure database instead of localStorage
3. Add additional security measures
4. Customize the UI to match your branding
5. Add additional features specific to your insurance advisors

## License

This project is licensed under the ISC License.

## Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) for facial recognition
- [Material-UI](https://mui.com/) for the user interface components
- [React](https://reactjs.org/) for the frontend framework

## Running the Application

After installation, you can start the app with:

```
npm start
```

This will start the development server on http://localhost:3000.

### Steps to Test the Application:

1. **Register as a new user**:
   - Fill out the multi-step registration form
   - Provide basic information, professional details, and account credentials

2. **Complete facial biometric registration**:
   - Allow camera access when prompted
   - Follow the instructions to capture your face
   - Confirm and register your facial biometric

3. **Login using your credentials**:
   - You can log in using the credentials you created
   - Or test the "Sign in with ID.me" button (note: this requires a valid ID.me configuration)

4. **Explore the dashboard**:
   - View your verification status
   - Learn about the security features protecting your account

## Production Implementation Considerations

For a production deployment, the following enhancements should be implemented:

1. **Backend Services**:
   - Implement a secure Node.js/Express backend or similar service
   - Add secure API endpoints for user management and authentication
   - Set up a proper database (PostgreSQL, MongoDB, etc.) instead of localStorage

2. **ID.me Integration**:
   - Create a real account with ID.me's developer platform
   - Configure your application with proper credentials
   - Implement server-side token exchange for security
   - Set up proper group affiliation checking for insurance advisors

3. **Facial Recognition Improvements**:
   - Deploy face-api.js models on your server
   - Implement secure storage of facial templates (encrypted database)
   - Add liveness detection to prevent photo attacks
   - Add periodic re-verification for ongoing security

4. **Security Enhancements**:
   - SSL/TLS encryption for all communications
   - JWT-based authentication with refresh tokens
   - Proper rate limiting to prevent brute force attacks
   - Strong input validation and sanitization

5. **Infrastructure**:
   - Deploy to a cloud provider (AWS, Azure, Google Cloud)
   - Set up CI/CD pipelines for testing and deployment
   - Implement monitoring and alerting
   - Configure proper logging and error tracking

## Additional Resources

- [ID.me Developer Documentation](https://developers.id.me/documentation)
- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/) 
