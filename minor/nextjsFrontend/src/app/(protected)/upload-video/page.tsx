
"use client";

import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Sidebar from "../dashboard/_Components/Sidebar";

const VideoUploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [processedVideoURL, setProcessedVideoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalysis = async () => {
    if (!videoFile) return alert("Please upload a video first!");
    setLoading(true);
    setProcessedVideoURL(null);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed!");

      const blob = await res.blob();
      const processedVideoBlobURL = URL.createObjectURL(blob);
      setProcessedVideoURL(processedVideoBlobURL);
    } catch (err) {
      alert("Something went wrong during analysis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="w-full max-w-3xl mx-auto mt-8 mb-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">
            Your journey to perfection starts here—upload your video and level up! 🚀🔥
          </h2>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {videoURL ? (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <p className="mb-2">Original Video</p>
                <video className="w-full max-w-md rounded-lg" controls>
                  <source src={videoURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {processedVideoURL && (
                <div className="flex flex-col items-center">
                  <p className="mb-2">Processed Video</p>
                  <video className="w-full max-w-md rounded-lg" controls>
                    <source src={processedVideoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ) : (
            <>
              <Upload size={48} className="text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop your video here or click to upload 📂
              </p>
            </>
          )}

          <div className="flex flex-col items-center text-gray-400 text-sm mt-2">
            <p className="mb-1">- Hold tight while we analyze your form ⏳</p>
            <p>- Get instant feedback & corrections below! ✅</p>
          </div>
        </div>

        <div className="mt-6 text-center flex flex-col items-center gap-4">
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg`}
          >
            {loading ? "Analyzing..." : "Start Analysis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadSection;














// "use client"
// import React, { useState, useRef } from 'react';
// import { Upload } from 'lucide-react';
// import Sidebar from '../dashboard/_Components/Sidebar';

// const VideoUploadSection = () => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [videoURL, setVideoURL] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("video/")) {
//       setVideoFile(file);
//       setVideoURL(URL.createObjectURL(file)); // Create a preview URL
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (file && file.type.startsWith("video/")) {
//       setVideoFile(file);
//       setVideoURL(URL.createObjectURL(file));
//     }
//   };

//   const handleClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   return (
//     <div>
//       <Sidebar />
//       <div className="w-full max-w-3xl mx-auto mt-8 mb-16 py-16">
//         <div className="text-center mb-16">
//           <h2 className="text-2xl font-bold text-blue-500 mb-4">
//             Your journey to perfection starts here—upload your video and level up! 🚀🔥
//           </h2>
//         </div>

//         <div
//           className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
//             isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//           }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           onClick={handleClick}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="video/*"
//             className="hidden"
//             onChange={handleFileChange}
//           />

//           {videoURL ? (
//             <video className="w-full max-w-md rounded-lg" controls>
//               <source src={videoURL} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <>
//               <Upload size={48} className="text-blue-500 mb-4" />
//               <p className="text-lg font-medium text-gray-700 mb-2">
//                 Drag & drop your video here or click to upload 📂
//               </p>
//             </>
//           )}

//           <div className="flex flex-col items-center text-gray-400 text-sm mt-2">
//             <p className="mb-1">- Hold tight while we analyze your form ⏳</p>
//             <p>- Get instant feedback & corrections below! ✅</p>
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer">
//             Start Analysis
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoUploadSection;
