import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import idMeService from "../services/IdMeService";

const Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Parse the query parameters from the callback URL
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setError(`Authentication failed: ${error}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError("No authorization code received from ID.me");
      setLoading(false);
      return;
    }

    const handleIdMeCallback = async () => {
      try {
        // Process the ID.me callback
        const result = await idMeService.handleCallback(code);

        // Extract user information from the result
        const { userInfo, advisorStatus } = result;

        // Verify that the user is an insurance advisor
        if (!advisorStatus || !advisorStatus.verified) {
          setError("Unable to verify insurance advisor status.");
          setLoading(false);
          return;
        }

        // Format the user data for our application
        const userData = {
          id: userInfo.id,
          name: `${userInfo.fname} ${userInfo.lname}`,
          email: userInfo.email,
          role: "advisor",
          faceVerified: false, // They still need to complete facial verification
          idMeVerified: true,
        };

        // Log the user in to our application
        await login(userData);

        // Redirect to face registration
        navigate("/face-registration");
      } catch (err) {
        console.error("Error processing ID.me callback:", err);
        setError("Failed to process authentication. Please try again.");
        setLoading(false);
      }
    };

    handleIdMeCallback();
  }, [location, login, navigate]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={60} sx={{ mb: 4 }} />
            <Typography variant="h5" gutterBottom>
              Verifying your identity...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we complete the verification process with ID.me.
            </Typography>
          </>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="body1" paragraph>
              You can try again by returning to the login page.
            </Typography>
            <button onClick={() => navigate("/login")}>Return to Login</button>
          </>
        ) : null}
      </Box>
    </Container>
  );
};

export default Callback;
