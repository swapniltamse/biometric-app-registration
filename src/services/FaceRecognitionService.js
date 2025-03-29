import * as faceapi from "face-api.js";

// Path to models
const MODEL_URL = "/models";

class FaceRecognitionService {
  constructor() {
    this.modelsLoaded = false;
    this.faceMatcherLoaded = false;
    this.faceMatcher = null;
    this.labeledDescriptors = [];
  }

  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);

      this.modelsLoaded = true;
      console.log("Face recognition models loaded successfully");
    } catch (error) {
      console.error("Error loading face recognition models:", error);
      throw error;
    }
  }

  async detectFace(imageElement) {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      // Use a more robust detector for registration
      const detections = await faceapi
        .detectAllFaces(
          imageElement,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections;
    } catch (error) {
      console.error("Error detecting face:", error);
      throw error;
    }
  }

  async registerFace(imageElement, userId) {
    try {
      const detections = await this.detectFace(imageElement);

      if (!detections || detections.length === 0) {
        throw new Error("No face detected in the image");
      }

      if (detections.length > 1) {
        throw new Error(
          "Multiple faces detected. Please ensure only one face is in the frame"
        );
      }

      const descriptor = detections[0].descriptor;

      // In a real application, you would save this descriptor to a database
      // For this demo, we'll store it in localStorage
      const storedDescriptors = localStorage.getItem(
        `face_descriptor_${userId}`
      );

      let descriptors = [];
      if (storedDescriptors) {
        descriptors = JSON.parse(storedDescriptors);
      }

      // Add the new descriptor
      descriptors.push(Array.from(descriptor));

      // Save to localStorage
      localStorage.setItem(
        `face_descriptor_${userId}`,
        JSON.stringify(descriptors)
      );

      // Update the face matcher if it's already loaded
      if (this.faceMatcherLoaded) {
        this.updateFaceMatcher();
      }

      return true;
    } catch (error) {
      console.error("Error registering face:", error);
      throw error;
    }
  }

  async verifyFace(imageElement, userId) {
    try {
      if (!this.faceMatcherLoaded) {
        await this.loadFaceMatcher(userId);
      }

      if (!this.faceMatcher) {
        throw new Error("No registered face found for verification");
      }

      const detections = await this.detectFace(imageElement);

      if (!detections || detections.length === 0) {
        throw new Error("No face detected in the image");
      }

      if (detections.length > 1) {
        throw new Error(
          "Multiple faces detected. Please ensure only one face is in the frame"
        );
      }

      const descriptor = detections[0].descriptor;

      // Compare with registered face
      const match = this.faceMatcher.findBestMatch(descriptor);

      return {
        isMatch: match.label !== "unknown",
        distance: match.distance,
        label: match.label,
      };
    } catch (error) {
      console.error("Error verifying face:", error);
      throw error;
    }
  }

  async loadFaceMatcher(userId) {
    try {
      await this.loadModels();

      // Get stored descriptors from localStorage
      const storedDescriptors = localStorage.getItem(
        `face_descriptor_${userId}`
      );

      if (!storedDescriptors) {
        this.faceMatcher = null;
        this.faceMatcherLoaded = true;
        return false;
      }

      const descriptors = JSON.parse(storedDescriptors);

      // Create labeled descriptors
      this.labeledDescriptors = [
        new faceapi.LabeledFaceDescriptors(
          userId,
          descriptors.map((desc) => new Float32Array(desc))
        ),
      ];

      // Create face matcher
      this.faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors, 0.6);
      this.faceMatcherLoaded = true;

      return true;
    } catch (error) {
      console.error("Error loading face matcher:", error);
      throw error;
    }
  }

  updateFaceMatcher() {
    // This would be called after registering a new face
    // For simplicity, in a real app you might get all user face descriptors from the backend
    this.faceMatcherLoaded = false;
  }

  clearStoredFaces(userId) {
    localStorage.removeItem(`face_descriptor_${userId}`);
    this.faceMatcherLoaded = false;
    this.faceMatcher = null;
  }
}

// Create a singleton instance
const faceRecognitionService = new FaceRecognitionService();

export default faceRecognitionService;
