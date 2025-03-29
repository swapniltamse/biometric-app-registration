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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";

const steps = ["Basic Information", "Professional Details", "Account Setup"];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Professional Details
  const [ssn, setSsn] = useState("");
  const [npn, setNpn] = useState("");
  const [agency, setAgency] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Account Setup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      let formattedValue = value;
      if (value.length > 3) {
        formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }
      if (value.length > 6) {
        formattedValue = `${formattedValue.slice(0, 9)}-${formattedValue.slice(
          9
        )}`;
      }
      setPhone(formattedValue);
    }
  };

  const validateCurrentStep = () => {
    setError("");

    if (activeStep === 0) {
      if (!firstName || !lastName || !email || !phone) {
        setError("Please fill in all fields");
        return false;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return false;
      }
      // Phone validation
      if (phone.replace(/\D/g, "").length !== 10) {
        setError("Please enter a valid phone number");
        return false;
      }
    } else if (activeStep === 1) {
      if (!ssn || !npn || !agency || !licenseNumber) {
        setError("Please fill in all fields");
        return false;
      }
      // SSN validation (simple check for format XXX-XX-XXXX)
      if (ssn.replace(/\D/g, "").length !== 9) {
        setError("Please enter a valid SSN");
        return false;
      }
      // NPN validation (simple check for length)
      if (npn.length < 5) {
        setError("Please enter a valid NPN");
        return false;
      }
    } else if (activeStep === 2) {
      if (!username || !password || !confirmPassword) {
        setError("Please fill in all fields");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    try {
      setLoading(true);

      // In a real app, you would validate SSN and NPN against your database here
      // For this demo, we'll simulate successful registration
      const userData = {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        ssn,
        npn,
        agency,
        licenseNumber,
        username,
        password,
      };

      await register(userData);

      // Redirect to face registration if registration successful
      navigate("/face-registration");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  id="phone"
                  autoComplete="tel"
                  placeholder="(XXX) XXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 3, mb: 2 }}
            >
              Next
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="npn"
                  label="National Producer Number (NPN)"
                  id="npn"
                  autoComplete="off"
                  value={npn}
                  onChange={(e) => setNpn(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="agency"
                  label="Agency/Broker Name"
                  id="agency"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="licenseNumber"
                  label="Insurance License Number"
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                mb: 2,
              }}
            >
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                mb: 2,
              }}
            >
              <Button onClick={handleBack}>Back</Button>
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="sm">
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
            Advisor Registration
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: "100%", my: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
            {renderStepContent(activeStep)}

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
