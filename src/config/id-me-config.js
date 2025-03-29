/**
 * ID.me OAuth Configuration
 *
 * This file contains the configuration for ID.me integration.
 * In a real application, you would store sensitive values in environment variables.
 */

const ID_ME_CONFIG = {
  // Replace these with your actual values from ID.me developer portal
  CLIENT_ID: "your_client_id_here",
  REDIRECT_URI: "http://localhost:3000/callback",
  AUTHORIZATION_ENDPOINT: "https://api.id.me/oauth/authorize",
  TOKEN_ENDPOINT: "https://api.id.me/oauth/token",
  USER_INFO_ENDPOINT: "https://api.id.me/api/public/v3/attributes.json",
  SCOPES: ["identity", "license", "verification"],

  // ID.me API endpoints
  VERIFY_INSURANCE_ADVISOR:
    "https://api.id.me/api/public/v3/verify/insurance_advisor.json",

  // Helper function to generate the authorization URL
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: "code",
      scope: this.SCOPES.join(" "),
    });

    return `${this.AUTHORIZATION_ENDPOINT}?${params.toString()}`;
  },
};

export default ID_ME_CONFIG;
