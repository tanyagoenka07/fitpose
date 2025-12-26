/**
 * Captures a frame from a video element and returns it as a base64 string
 */
export function captureVideoFrame(video: HTMLVideoElement): string {
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")
  
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
    // Convert the canvas to a base64 data URL
    return canvas.toDataURL("image/jpeg", 0.8)
  }
  
  /**
   * Streams video frames to the server at a specified interval
   */
  export function streamVideoFrames(video: HTMLVideoElement, onAnalysis: (data: any) => void, fps = 5): () => void {
    // Calculate interval in milliseconds based on desired FPS
    const interval = 1000 / fps
  
    // Start the interval
    const intervalId = setInterval(async () => {
      if (video.paused || video.ended) return
  
      try {
        // Capture the current frame
        const frameData = captureVideoFrame(video)
  
        // Send the frame to the server
        const response = await fetch("/api/stream-frames", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ frame: frameData }),
        })
  
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`)
        }
  
        const data = await response.json()
  
        // Call the callback with the analysis data
        onAnalysis(data.analysis)
      } catch (error) {
        console.error("Error streaming frame:", error)
      }
    }, interval)
  
    // Return a function to stop streaming
    return () => clearInterval(intervalId)
  }
  
  