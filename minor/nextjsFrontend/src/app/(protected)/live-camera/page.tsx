// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { AlertCircle, Camera, AlertTriangle, RefreshCw } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import Sidebar from "../dashboard/_Components/Sidebar"
// import { streamVideoFrames } from "@/lib/video-utils"

// export default function LiveCameraPage() {
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const [showAlert, setShowAlert] = useState(false)
//   const [stream, setStream] = useState<MediaStream | null>(null)
//   const [correctCount, setCorrectCount] = useState(0)
//   const [incorrectCount, setIncorrectCount] = useState(0)
//   const [cameraError, setCameraError] = useState<string | null>(null)
//   const [mode, setMode] = useState<"Beginner" | "Pro">("Beginner")
//   const [sessionId, setSessionId] = useState<string | null>(null)
//   const [reportPath, setReportPath] = useState<string | null>(null)
//   const [videoPath, setVideoPath] = useState<string | null>(null)

//   // Reference to the frame streaming stop function
//   const stopStreamingRef = useRef<(() => void) | null>(null)

//   const checkCameraAccess = async () => {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices()
//       const videoDevices = devices.filter((device) => device.kind === "videoinput")

//       console.log("Available Camera Devices:", videoDevices)

//       if (videoDevices.length === 0) {
//         setCameraError("No camera devices found. Please connect a camera.")
//         return false
//       }

//       return true
//     } catch (error) {
//       console.error("Device enumeration error:", error)
//       setCameraError("Unable to check camera devices. Permissions might be blocked.")
//       return false
//     }
//   }

//   const startCamera = async () => {
//     try {
//       setCameraError(null);
  
//       const devicesAvailable = await checkCameraAccess();
//       if (!devicesAvailable) return;
  
//       const userStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: "user",
//         },
//       });
  
//       if (!userStream) {
//         throw new Error("No video stream available");
//       }
  
//       setStream(userStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = userStream;
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current?.play().catch((e) => {
//             console.error("Error playing video:", e);
//             setCameraError("Unable to start video stream");
//           });
//         };
//       }
  
//       // Start recording on the server
//       const response = await fetch("/api/start-recording", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mode }),
//       });
  
//       // Enhanced error handling
//       if (!response.ok) {
//         const errorDetails = await response.json();
//         console.error("Recording start failed:", {
//           status: response.status,
//           statusText: response.statusText,
//           errorDetails,
//         });
  
//         throw new Error(
//           errorDetails?.error ||
//             `Failed to start recording: ${response.statusText}`
//         );
//       }
  
//       const data = await response.json();
//       setSessionId(data.sessionId);
//       setIsRecording(true);
  
//       // Reset counts when starting a new session
//       setCorrectCount(0);
//       setIncorrectCount(0);
  
//       // Start streaming frames to the server
//       if (videoRef.current) {
//         const stopStreaming = streamVideoFrames(videoRef.current, (analysisData) => {
//           if (
//             analysisData.squat_state === "correct_squat" ||
//             (analysisData.play_sound && analysisData.play_sound.isDigit)
//           ) {
//             setCorrectCount((prev) => prev + 1);
//           } else if (
//             analysisData.squat_state === "incorrect_squat" ||
//             analysisData.play_sound === "incorrect"
//           ) {
//             setIncorrectCount((prev) => prev + 1);
//           }
//         });
  
//         // Store the stop function for cleanup
//         stopStreamingRef.current = stopStreaming;
//       }
//     } catch (error) {
//       console.error("Detailed Camera Access Error:", error);
  
//       setCameraError(
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred while starting the camera"
//       );
  
//       setIsRecording(false);
//     }
//   };
  
//   const stopCamera = async () => {
//     // Stop streaming frames
//     if (stopStreamingRef.current) {
//       stopStreamingRef.current()
//       stopStreamingRef.current = null
//     }

//     // Stop the media stream
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop())
//       setStream(null)
//     }

//     // Stop recording on the server
//     try {
//       const response = await fetch("/api/stop-recording", {
//         method: "POST",
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to stop recording: ${response.statusText}`)
//       }

//       const data = await response.json()
//       setReportPath(data.reportPath)
//       setVideoPath(data.videoPath)
//       setShowAlert(true)
//     } catch (error) {
//       console.error("Error stopping recording:", error)
//     }

//     setIsRecording(false)
//   }

//   useEffect(() => {
//     return () => {
//       // Cleanup on component unmount
//       if (stopStreamingRef.current) {
//         stopStreamingRef.current()
//       }

//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop())
//       }
//     }
//   }, [stream])

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-grow p-6 space-y-4 max-w-4xl mx-auto w-full">
//         <Card className="max-w-3xl mx-auto">
//           <CardContent className="p-6">
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Mode</label>
//               <div className="flex space-x-4">
//                 <Button
//                   variant={mode === "Beginner" ? "default" : "outline"}
//                   onClick={() => setMode("Beginner")}
//                   disabled={isRecording}
//                 >
//                   Beginner
//                 </Button>
//                 <Button
//                   variant={mode === "Pro" ? "default" : "outline"}
//                   onClick={() => setMode("Pro")}
//                   disabled={isRecording}
//                 >
//                   Pro
//                 </Button>
//               </div>
//             </div>

//             <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
//               {cameraError ? (
//                 <div className="text-center text-red-600 flex flex-col items-center p-4">
//                   <AlertTriangle className="h-12 w-12 mb-4" />
//                   <p className="text-lg mb-4 text-center">{cameraError}</p>
//                   <div className="flex space-x-2">
//                     <Button onClick={startCamera} className="flex items-center">
//                       <RefreshCw className="mr-2 h-4 w-4" />
//                       Try Again
//                     </Button>
//                     <Button variant="outline" onClick={() => window.open("https://support.anthropic.com", "_blank")}>
//                       Get Help
//                     </Button>
//                   </div>
//                 </div>
//               ) : !isRecording ? (
//                 <div className="text-center">
//                   <Camera className="h-12 w-12 mx-auto mb-4 text-gray-500" />
//                   <p className="text-gray-500 dark:text-gray-400 mb-2">Camera feed will appear here</p>
//                   <Button onClick={startCamera}>Start Camera</Button>
//                 </div>
//               ) : (
//                 <div className="w-full h-full relative">
//                   <video ref={videoRef} className="w-full h-full object-cover rounded-lg" autoPlay playsInline muted />
//                   <div className="absolute top-4 right-4 flex space-x-2">
//                     <div className="bg-red-500 rounded-full h-3 w-3 animate-pulse"></div>
//                     <span className="text-white text-xs">Recording</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center">
//               <div>
//                 <div className="text-sm font-medium">Mode: {mode}</div>
//                 <div className="grid grid-cols-2 gap-4 mt-2">
//                   <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
//                     <span className="text-xs text-green-800 dark:text-green-300">Correct:</span>
//                     <span className="font-bold ml-1">{correctCount}</span>
//                   </div>
//                   <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
//                     <span className="text-xs text-red-800 dark:text-red-300">Incorrect:</span>
//                     <span className="font-bold ml-1">{incorrectCount}</span>
//                   </div>
//                 </div>
//               </div>

//               {isRecording ? (
//                 <Button variant="destructive" onClick={stopCamera}>
//                   Stop & Generate Report
//                 </Button>
//               ) : (
//                 <Button onClick={startCamera} disabled={isRecording}>
//                   Start Camera
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {showAlert && (
//           <Alert className="max-w-3xl mx-auto">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Report Generated</AlertTitle>
//             <AlertDescription>
//               Your workout report has been generated and saved.
//               <div className="mt-2 flex space-x-2">
//                 <Button size="sm" variant="outline" onClick={() => window.open("/api/download-video", "_blank")}>
//                   Download Video
//                 </Button>
//                 <Button size="sm" variant="outline" onClick={() => window.open("/api/download-report", "_blank")}>
//                   Download Report
//                 </Button>
//               </div>
//             </AlertDescription>
//           </Alert>
//         )}
//       </div>
//     </div>
//   )
// }



// "use client";
// import { useEffect, useRef, useState } from "react";
// import Sidebar from "../dashboard/_Components/Sidebar";

// const LiveCamera = () => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [cameraStarted, setCameraStarted] = useState(false);
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const startCamera = async () => {
//     try {
//       const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       setStream(userStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = userStream;
//       }
//       setCameraStarted(true);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   // Function to stop the camera
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//     setCameraStarted(false);
//   };

//   // Cleanup when component unmounts
//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   return (
//     <div>
//       <Sidebar />
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="w-full max-w-3xl mx-auto bg-black p-6 rounded-lg shadow-lg">
//           {/* Heading Section */}
//           <h2 className="text-white text-center text-2xl font-bold mb-4">
//             Step into the frame & perfect your moves! 🎥🔥
//           </h2>
//           <p className="text-gray-400 text-center mb-4">
//             📌 Ensure you are fully visible & grant camera access.
//           </p>

//           {/* Video Feed (Always in DOM) */}
//           <div className="mt-6 flex justify-center">
//             <video
//               ref={videoRef}
//               className={`w-full max-w-3xl rounded-lg shadow-lg ${cameraStarted ? "block" : "hidden"}`}
//               autoPlay
//               playsInline
//             />
//           </div>

//           {/* Start/Stop Camera Button */}
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={cameraStarted ? stopCamera : startCamera}
//               className={`px-6 py-3 rounded-lg text-white transition duration-300 cursor-pointer ${
//                 cameraStarted ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {cameraStarted ? "📴 Stop Camera" : "📷 Start Camera"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveCamera;


"use client";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../dashboard/_Components/Sidebar";
import { sendFrameToBackend } from "@/app/api/livefeed/route";

const LiveCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  // Start the camera
  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      setCameraStarted(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraStarted(false);
  };

  // Function to capture frames and send them to the backend
  // Function to capture frames and send them to the backend
  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      const context = canvas.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      // Convert the frame to a Blob and send it to the backend
      canvas.toBlob(async (blob) => {
        if (blob) {
          const feedbackData = await sendFrameToBackend(blob); // Get feedback from backend
          setFeedback(feedbackData); // Update the feedback state
        }
      }, "image/jpeg");
    }
  };
  
  


  // Call the capture function every 500ms for live feedback
  useEffect(() => {
    if (cameraStarted) {
      const interval = setInterval(() => {
        captureFrame();
      }, 500); // Capture frame every 500ms

      return () => clearInterval(interval);
    }
  }, [cameraStarted]);

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-3xl mx-auto bg-black p-6 rounded-lg shadow-lg">
          <h2 className="text-white text-center text-2xl font-bold mb-4">
            Step into the frame & perfect your moves! 🎥🔥
          </h2>
          <p className="text-gray-400 text-center mb-4">
            📌 Ensure you are fully visible & grant camera access.
          </p>

          {/* Video Feed */}
          <div className="mt-6 flex justify-center">
            <video
              ref={videoRef}
              className={`w-full max-w-3xl rounded-lg shadow-lg ${cameraStarted ? "block" : "hidden"}`}
              autoPlay
              playsInline
            />
          </div>

          {/* Feedback Section */}
          <div className="mt-6 text-center">
            <h3 className="text-white text-lg">Feedback:</h3>
            <p className="text-gray-400">{feedback}</p>
          </div>

          {/* Start/Stop Camera Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={cameraStarted ? stopCamera : startCamera}
              className={`px-6 py-3 rounded-lg text-white transition duration-300 cursor-pointer ${
                cameraStarted ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {cameraStarted ? "📴 Stop Camera" : "📷 Start Camera"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCamera;









