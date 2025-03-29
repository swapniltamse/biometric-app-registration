import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

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
        <ErrorOutlineIcon
          sx={{ fontSize: 100, color: "text.secondary", mb: 2 }}
        />
        <Typography variant="h3" component="h1" gutterBottom>
          404: Page Not Found
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 3 }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
