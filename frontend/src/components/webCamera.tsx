"use client"
import { useEffect, useState, useRef } from 'react';

import io from 'socket.io-client';

// const socketRef = io('http://localhost:8000'); // Your backend URL

export default function WebCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef(null);
  const [nameString, setNameString] = useState(''); 

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    }
    console.log("here")
    getMedia();

    // Capture frames at intervals
    // const interval = setInterval(() => {
    //   const context = canvasRef.current.getContext('2d');
    //   context.drawImage(videoRef.current, 0, 0, 640, 480);
    //   const imageData = canvasRef.current.toDataURL('image/jpeg');
    //   print("imageData", imageData);
    //   socket.emit('frame', imageData);
    // }, 100); // Send every 100ms

    const captureAndSendFrame = () => {
      console.log("captureAndSendFrame");
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      // console.log("imageData", imageData)
      // canvasRef.current.toBlob(blob => {
      //   const formData = new FormData();
      //   console.log("toBlob")
      //   formData.append('file', blob, 'frame.jpg');

      //   fetch('http://localhost:8000/process-image', {
      //     method: 'POST',
      //     body: formData,
      //   });
      // }, 'image/jpeg');

      canvasRef.current.toBlob(blob => {
        const formData = new FormData();
        console.log("toBlob");
        formData.append('file', blob, 'frame.jpg');
      
        fetch('http://localhost:8000/process-image', {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          if (!response.ok) {
            setNameString('')
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming your FastAPI backend returns a JSON response
        })
        .then(data => {
          console.log('Response data:', data);
          // Handle the response data here (e.g., update the UI)
          setNameString(data["name"])
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      }, 'image/jpeg');

    };

    const interval = setInterval(captureAndSendFrame, 2000); // 4 fps

    // const interval = setInterval(() => {
    //   const context = canvasRef.current.getContext('2d');
    //   context.drawImage(videoRef.current, 0, 0, 640, 480);
    //   canvasRef.current.toBlob(blob => {
    //     const formData = new FormData();
    //     formData.append('image', blob, 'frame.jpg');

    //     fetch('http://localhost:8000/process-image', {
    //       method: 'POST',
    //       body: formData,
    //     });
    //   }, 'image/jpeg');
    // }, 100);
    


    return () => {
      // Clean up the stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  // return (
  //   <div>
  //     <h1>Webcam Stream</h1>
  //     <video ref={videoRef} autoPlay playsInline />
  //   </div>
  // );
  
  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '400px', height: '300px' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} width="400" height="300"></canvas>
      <p>Matched Name</p>
      <p>{nameString}</p>
    </div>
  );
}

// "use client"
// // VideoStream.js
// import React, { useRef, useEffect } from 'react';

// const WebCamera = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // Request access to the webcam
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then((stream) => {
//         // Set the video element's source to the webcam stream
//         videoRef.current.srcObject = stream;
//       })
//       .catch((err) => {
//         console.error('Error accessing the camera: ', err);
//       });
//   }, []);

//   return (
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       style={{ width: '640px', height: '480px' }}
//     />
//   );
// };

// export default WebCamera;




