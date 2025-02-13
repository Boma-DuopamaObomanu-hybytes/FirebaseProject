import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { db, setDoc, doc } from "./firebase";

const FaceRegister = ({ userId }) => {
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

  const handleFaceRegistration = async () => {
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

    // Save the descriptor in Firebase
    await setDoc(doc(db, "users", userId), {
      faceDescriptor: Array.from(detections.descriptor),
      name: "User Name", // Replace with actual user info
    });

    setMessage("Face registered successfully!");
  };

  return (
    <div>
      <h2>Register Face</h2>
      <video ref={videoRef} autoPlay muted width="480" height="360" />
      <button onClick={handleFaceRegistration}>Register Face</button>
      <p>{message}</p>
    </div>
  );
};

export default FaceRegister;
