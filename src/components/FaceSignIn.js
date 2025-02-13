import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { db, doc, getDoc } from "./firebase";

const FaceSignIn = () => {
  const videoRef = useRef(null);
  const [message, setMessage] = useState("Initializing...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      startVideo();
      setIsReady(true);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  const handleFaceRecognition = async () => {
    if (!isReady) {
      setMessage("Face recognition models are still loading...");
      return;
    }

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      setMessage("No face detected. Please try again.");
      return;
    }

    const userId = "user123"; // Replace with a user authentication ID
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      setMessage("User not found.");
      return;
    }

    const storedDescriptor = userDoc.data().faceDescriptor;
    const faceMatcher = new faceapi.FaceMatcher([storedDescriptor]);

    const result = faceMatcher.findBestMatch(detections.descriptor);
    if (result.label === "unknown") {
      setMessage("Face not recognized.");
    } else {
      setMessage("Welcome, " + userDoc.data().name);
    }
  };

  return (
    <div>
      <h2>Face Sign-In</h2>
      <video ref={videoRef} autoPlay muted width="480" height="360" />
      <button onClick={handleFaceRecognition}>Sign In with Face</button>
      <p>{message}</p>
    </div>
  );
};

export default FaceSignIn;
