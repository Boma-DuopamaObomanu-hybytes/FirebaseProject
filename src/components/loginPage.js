import React, { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { FaApple } from "react-icons/fa"; // Apple Icon
import { AiFillLock } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import Logo from "../logo.svg";
import app from "../firebaseConfig";
import {
  getDatabase,
  ref,
  set,
  push,
  query,
  orderByChild,
  get,
  remove,
} from "firebase/database";
import * as faceapi from "face-api.js"; // Face recognition library
import { getAuth } from "firebase/auth";

export default function LoginPage() {
  let [inputName, setInputName] = useState("");
  let [inputEmail, setInputEmail] = useState("");
  let [inputNumber, setInputNumber] = useState("");
  let [faceMatcher, setFaceMatcher] = useState(null);
  let [isFaceVerified, setIsFaceVerified] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const db = getFirestore(app);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
  
    loadModels();
    startVideo(); // Start the webcam
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.mtcnn.loadFromUri("/models"),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ]);
  
      console.log("Face-api models loaded successfully.");
    } catch (error) {
      console.error("Error loading face-api models:", error);
    }
  };
  

  // Capture and compare face
  const captureFace = async () => {
    try {
      if (!inputEmail) {
        alert("Please enter your email before scanning your face.");
        return;
      }
  
      const userRef = doc(db, "users", inputEmail);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        alert("User not found.");
        return;
      }
  
      console.log("User data retrieved successfully:", userSnap.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to retrieve user data. Check your internet connection.");
    }
  };
  
  

  const registerFace = async () => {
    const video = videoRef.current;
    if (!video) return;

    const detection = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected.");
      return;
    }


    const userRef = doc(db, "users", inputEmail);
    await setDoc(userRef, {
      fullName: inputName,
      emailAddress: inputEmail,
      phoneNumber: inputNumber,
      faceDescriptor: Array.from(detection.descriptor),
    });

    alert("Face registered successfully!");
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "50%",
          color: "white",
          background: "#FFFFFF",
          borderRadius: 10,
          border: "1px solid grey",
          margin: "10px 30px",
        }}
      >
        <div
          style={{
            background: "grey",
            width: "8%",
            marginLeft: 10,
            borderRadius: 10,
            padding: "1px",
          }}
        >
          <p style={{ color: "white", textAlign: "center" }}>LOGO</p>
        </div>

        <div>
          <h1 style={{ color: "black", textAlign: "center" }}>Welcome Back!</h1>
        </div>

        <div>
          <p style={{ color: "black", textAlign: "center" }}>
            Log in with face ID
          </p>
        </div>

        <div>
        <video ref={videoRef} autoPlay playsInline width="300" height="200"></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>

        <button onClick={captureFace}>Scan Face</button>
        <button onClick={registerFace}>Register Face</button>

        <div
          style={{
            display: "flex",
            background: "#F7F7F7",
            width: "100%",
            marginLeft: 10,
            borderRadius: 15,
          }}
        >
          <MdEmail />
          <input
            name="emailAddress"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="Email Address"
          />
        </div>

        <div
          style={{
            display: "flex",
            background: "#F7F7F7",
            width: "100%",
            marginLeft: 10,
            borderRadius: 15,
          }}
        >
          <AiFillLock />
          <input name="password" type="password" placeholder="Password" />
        </div>

        <p style={{ textAlign: "right" }}>Forgot Password?</p>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              background: "#FFFFFF",
              width: "40%",
              borderRadius: 30,
              border: "1px solid grey",
            }}
          >
            <FcGoogle style={{ marginRight: "8px" }} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              background: "#FFFFFF",
              width: "40%",
              borderRadius: 30,
              border: "1px solid grey",
            }}
          >
            <FaApple style={{ marginRight: "8px", color: "black" }} />
          </div>
        </div>

        <div>
          <button>Sign up</button>
          <button>Log in</button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "50%",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
