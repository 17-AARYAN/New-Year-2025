import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function Camera({ onClose }) {
  const videoRef = useRef(null);
  const [message, setMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startCamera();
    }
  }, [modelsLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Camera access denied:', err);
      setMessage('Please allow camera access.');
    }
  };

  const captureAndCompare = async () => {
    const video = videoRef.current;

    // Detect faces in the video feed
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

    if (!detections.length) {
      setMessage('No face detected. Try again!');
      return;
    }

    // Load reference image
    const referenceImage = await faceapi.fetchImage('./assets/preeti.jpg');
    const referenceDetection = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor();

    if (!referenceDetection) {
      setMessage('Reference face not found!');
      return;
    }

    // Create face matcher
    const faceMatcher = new faceapi.FaceMatcher(referenceDetection.descriptor);

    // Match detected faces
    const bestMatch = detections.map((d) => faceMatcher.findBestMatch(d.descriptor));
    if (bestMatch.some((match) => match.label !== 'unknown')) {
      setMessage('🎉 Happy NEW YEAR 2025! 🎉');
    } else {
      setMessage('Face not recognized. Try again!');
    }
  };

  return (
    <div className="camera-container">
      {modelsLoaded ? (
        <>
          <video ref={videoRef} autoPlay className="video" />
          <button onClick={captureAndCompare}>Capture & Compare</button>
          <button onClick={onClose}>Close</button>
        </>
      ) : (
        <p>Loading Face Recognition Models...</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Camera;
