// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
// //       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
// //       </main>
// //     </div>
// //   );
// // }

"use client"
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

// const socketRef = io('http://localhost:8000'); // Your backend URL

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef(null);

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

    // const captureAndSendFrame = () => {
    //   if (videoRef.current && canvasRef.current) {
    //     const context = canvasRef.current.getContext('2d');
    //     context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    //     const imageData = canvasRef.current.toDataURL('image/jpeg');
    //     console.log("imageData", imageData)
    //     // socketRef.current.emit('frame', imageData);
    //   }
    // };

    // const interval = setInterval(captureAndSendFrame, 1000 / 30); // 30 fps

    const interval = setInterval(() => {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      canvasRef.current.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        fetch('http://localhost:8000/process-image', {
          method: 'POST',
          body: formData,
        });
      }, 'image/jpeg');
    }, 100);
    


    return () => {
      // Clean up the stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Webcam Stream</h1>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}


// "use client"
// // components/WebcamSocket.js
// import React, { useRef, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000'); // Your backend URL

// export default function Page() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Access webcam
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(stream => {
//         videoRef.current.srcObject = stream;
//       });

//     // Capture frames at intervals
//     const interval = setInterval(() => {
//       const context = canvasRef.current.getContext('2d');
//       context.drawImage(videoRef.current, 0, 0, 640, 480);
//       const imageData = canvasRef.current.toDataURL('image/jpeg');
//       socket.emit('frame', imageData);
//     }, 100); // Send every 100ms

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <video ref={videoRef} autoPlay style={{ display: 'none' }} />
//       <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
//     </>
//   );
// };