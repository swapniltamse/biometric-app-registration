import React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FaceIcon from "@mui/icons-material/Face";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advisor Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome to your secure insurance advisor portal. Your identity has
          been verified.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: "100%" }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                title="Advisor Profile"
                avatar={
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <AssignmentIndIcon />
                  </Avatar>
                }
              />
              <Divider />
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.light",
                      mr: 2,
                    }}
                  >
                    {currentUser?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{currentUser?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Licensed Insurance Advisor
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Verification Status
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VerifiedUserIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Identity Verified"
                      secondary="Basic credentials confirmed"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FaceIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Facial Authentication Active"
                      secondary="Biometric security enabled"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BusinessCenterIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Professional Status Active"
                      secondary="License and NPN verified"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Security Features */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                title="Security Features"
                avatar={
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <SecurityIcon />
                  </Avatar>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Your account is secured with industry-leading security
                  features:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          Facial Biometric Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your facial template is securely stored and used for
                          identity verification during login, protecting against
                          unauthorized access even if your credentials are
                          compromised.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          Multi-factor Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your account requires multiple verification factors:
                          something you know (password), something you are
                          (facial biometrics), and something you have
                          (professional credentials).
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          Professional Verification
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your NPN and license information are verified against
                          industry databases to confirm your professional status
                          and prevent impersonation.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          Secure Session Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          All session data is encrypted and regularly validated
                          to prevent session hijacking and ensure continuous
                          security throughout your usage.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          This is a demonstration of a secure biometric authentication system.
          In a production environment, this dashboard would include additional
          advisor tools and features.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
