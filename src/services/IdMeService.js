import axios from "axios";
import ID_ME_CONFIG from "../config/id-me-config";

/**
 * Service to handle ID.me integration
 * In a real application, token exchange would be handled by a backend service
 * for security reasons (to keep client_secret secure).
 */
class IdMeService {
  /**
   * Redirects the user to the ID.me authorization page
   */
  redirectToIdMe() {
    window.location.href = ID_ME_CONFIG.getAuthorizationUrl();
  }

  /**
   * Exchanges the authorization code for an access token
   * NOTE: This should be done server-side in a production application
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(ID_ME_CONFIG.TOKEN_ENDPOINT, {
        code,
        client_id: ID_ME_CONFIG.CLIENT_ID,
        client_secret: "YOUR_CLIENT_SECRET", // This should be kept secure on a server
        redirect_uri: ID_ME_CONFIG.REDIRECT_URI,
        grant_type: "authorization_code",
      });

      return response.data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  /**
   * Fetches user information using the access token
   */
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(ID_ME_CONFIG.USER_INFO_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }

  /**
   * Verifies if the user is an insurance advisor
   */
  async verifyInsuranceAdvisor(accessToken) {
    try {
      const response = await axios.get(ID_ME_CONFIG.VERIFY_INSURANCE_ADVISOR, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error verifying insurance advisor status:", error);
      throw error;
    }
  }

  /**
   * Handles the callback from ID.me
   * In a real application, most of this would be done on the server
   */
  async handleCallback(code) {
    try {
      // Exchange code for token
      const tokenData = await this.exchangeCodeForToken(code);
      const { access_token } = tokenData;

      // Get user information
      const userInfo = await this.getUserInfo(access_token);

      // Verify insurance advisor status if needed
      const advisorStatus = await this.verifyInsuranceAdvisor(access_token);

      return {
        userInfo,
        advisorStatus,
        tokens: tokenData,
      };
    } catch (error) {
      console.error("Error handling ID.me callback:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const idMeService = new IdMeService();

export default idMeService;
