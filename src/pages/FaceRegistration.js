import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useAuth } from "../context/AuthContext";
import faceRecognitionService from "../services/FaceRecognitionService";

const steps = ["Prepare", "Capture", "Verify"];

const FaceRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const webcamRef = useRef(null);
  const imageRef = useRef(null);

  const { currentUser, updateUserData } = useAuth();
  const navigate = useNavigate();

  // Load face models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        await faceRecognitionService.loadModels();
        setLoading(false);
      } catch (error) {
        console.error("Error loading face recognition models:", error);
        setError("Failed to load face recognition models. Please try again.");
        setLoading(false);
      }
    };

    loadModels();

    // Clean up on unmount
    return () => {
      // Any cleanup code here
    };
  }, []);

  const captureImage = useCallback(async () => {
    if (!webcamRef.current) {
      setError("Camera not available. Please try again.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }

      setCapturedImage(imageSrc);

      // Create an image element from the captured screenshot
      const img = new Image();
      img.src = imageSrc;

      img.onload = async () => {
        try {
          // Detect face in the captured image
          const detections = await faceRecognitionService.detectFace(img);

          if (!detections || detections.length === 0) {
            setError(
              "No face detected. Please try again and make sure your face is clearly visible."
            );
            setLoading(false);
            return;
          }

          if (detections.length > 1) {
            setError(
              "Multiple faces detected. Please ensure only your face is in the frame."
            );
            setLoading(false);
            return;
          }

          // Face detected successfully
          setFaceCaptured(true);
          setLoading(false);
          setActiveStep(2); // Move to verification step
        } catch (error) {
          console.error("Error detecting face:", error);
          setError("Failed to detect face. Please try again.");
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError("Failed to process captured image. Please try again.");
        setLoading(false);
      };
    } catch (error) {
      console.error("Error capturing image:", error);
      setError("Failed to capture image. Please try again.");
      setLoading(false);
    }
  }, [webcamRef]);

  const registerFace = useCallback(async () => {
    if (!capturedImage || !currentUser) {
      setError("No image captured or user not authenticated.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Create an image element from the captured screenshot
      const img = new Image();
      img.src = capturedImage;

      img.onload = async () => {
        try {
          // Register face with the service
          await faceRecognitionService.registerFace(img, currentUser.id);

          // Update user data to indicate face verification is complete
          updateUserData({ faceVerified: true });

          setFaceVerified(true);
          setLoading(false);
        } catch (error) {
          console.error("Error registering face:", error);
          setError("Failed to register face. Please try again.");
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError("Failed to process image for registration. Please try again.");
        setLoading(false);
      };
    } catch (error) {
      console.error("Error registering face:", error);
      setError("Failed to register face. Please try again.");
      setLoading(false);
    }
  }, [capturedImage, currentUser, updateUserData]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);

    // Reset state if going back from capture step
    if (activeStep === 2) {
      setFaceCaptured(false);
      setCapturedImage(null);
    }

    setError("");
  };

  const retakePhoto = () => {
    setFaceCaptured(false);
    setCapturedImage(null);
    setActiveStep(1);
    setError("");
  };

  const completeRegistration = () => {
    navigate("/dashboard");
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Prepare step
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Facial Verification Setup
            </Typography>
            <Typography variant="body1" paragraph>
              We need to set up facial verification for your account to provide
              an additional layer of security.
            </Typography>
            <Typography variant="body1" paragraph>
              Please make sure you are in a well-lit environment and your face
              is clearly visible.
            </Typography>
            <Typography variant="body1" paragraph>
              This facial verification will be used to authenticate you each
              time you log in.
            </Typography>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
              Continue
            </Button>
          </Box>
        );

      case 1: // Capture step
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Capture Your Face
            </Typography>
            <Typography variant="body1" paragraph>
              Position your face within the frame and click "Capture" when
              ready.
            </Typography>

            <Box className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
                onUserMedia={() => setCameraReady(true)}
                onUserMediaError={(error) => {
                  console.error("Camera error:", error);
                  setError(
                    "Failed to access camera. Please make sure your camera is connected and you have granted permission to use it."
                  );
                }}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                }}
              />
              <div className="webcam-overlay"></div>
            </Box>

            <Button
              variant="contained"
              onClick={captureImage}
              disabled={loading || !cameraReady}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Capture"}
            </Button>
            <Button
              onClick={handleBack}
              disabled={loading}
              sx={{ mt: 3, ml: 2 }}
            >
              Back
            </Button>
          </Box>
        );

      case 2: // Verify step
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verify Captured Image
            </Typography>

            {!faceVerified ? (
              <>
                <Typography variant="body1" paragraph>
                  Is this image clear? You will use this for future logins.
                </Typography>

                <Box sx={{ mb: 3, mt: 2 }}>
                  {capturedImage && (
                    <img
                      ref={imageRef}
                      src={capturedImage}
                      alt="Captured face"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "320px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Box>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={retakePhoto}
                      disabled={loading}
                    >
                      Retake Photo
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={registerFace}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Confirm & Register"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{ fontSize: 64, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Face Registration Complete!
                </Typography>
                <Typography variant="body1" paragraph>
                  Your facial verification has been successfully set up.
                </Typography>
                <Typography variant="body1" paragraph>
                  You can now use your face to authenticate when logging in.
                </Typography>
                <Button
                  variant="contained"
                  onClick={completeRegistration}
                  sx={{ mt: 2 }}
                >
                  Continue to Dashboard
                </Button>
              </Box>
            )}
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </Box>
      </Paper>
    </Container>
  );
};

export default FaceRegistration;
