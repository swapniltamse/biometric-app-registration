import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";
import idMeService from "../services/IdMeService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ssn, setSsn] = useState("");
  const [npn, setNpn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !ssn || !npn) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // In a real app, you would validate SSN and NPN against your database here
      // For this demo, we'll simulate successful authentication

      await login({ username, password, ssn, npn });

      // Redirect to face registration if login successful
      navigate("/face-registration");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format SSN as user types
  const handleSsnChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      let formattedValue = value;
      if (value.length > 3) {
        formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
      }
      if (value.length > 5) {
        formattedValue = `${formattedValue.slice(0, 6)}-${formattedValue.slice(
          6
        )}`;
      }
      setSsn(formattedValue);
    }
  };

  // Handle ID.me login
  const handleIdMeLogin = () => {
    idMeService.redirectToIdMe();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Advisor Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleIdMeLogin}
          >
            Sign in with ID.me
          </Button>

          <Divider sx={{ width: "100%", my: 2 }}>OR</Divider>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="ssn"
              label="Social Security Number"
              id="ssn"
              autoComplete="off"
              placeholder="XXX-XX-XXXX"
              value={ssn}
              onChange={handleSsnChange}
              inputProps={{ maxLength: 11 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="npn"
              label="National Producer Number (NPN)"
              id="npn"
              autoComplete="off"
              value={npn}
              onChange={(e) => setNpn(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
