import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"

const execPromise = promisify(exec)
const PYTHON_PATH = process.env.PYTHON_PATH || "python"
const SCRIPT_PATH = process.env.SCRIPT_PATH || "./ai_fitness_wrapper.py"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const video = formData.get("video") as File
    const mode = (formData.get("mode") as string) || "Beginner"

    if (!video) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const timestamp = new Date().getTime()
    const videoPath = path.join(uploadDir, `upload_${timestamp}.mp4`)

    // Save the uploaded video
    const videoBuffer = Buffer.from(await video.arrayBuffer())
    await writeFile(videoPath, videoBuffer)

    // Process the video with the Python script
    const command = `${PYTHON_PATH} ${SCRIPT_PATH} process_video --video_path ${videoPath} --mode ${mode}`

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
    }

    // Parse the output to get the paths to the generated files
    const result = JSON.parse(stdout)

    // Store paths in environment variables for download routes
    process.env.REPORT_PATH = result.report_path
    process.env.VIDEO_PATH = result.video_path

    return NextResponse.json({
      success: true,
      message: "Video processed successfully",
      reportPath: result.report_path,
      videoPath: result.video_path,
      stats: result.stats,
    })
  } catch (error) {
    console.error("Error processing video:", error)
    return NextResponse.json({ error: "Failed to process video" }, { status: 500 })
  }
}

// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   // In a real implementation, you would:
//   // 1. Extract the video file from the FormData
//   // 2. Save it to a temporary location
//   // 3. Call your Python script to process the video
//   // 4. Return the results

//   console.log("Processing video")

//   return NextResponse.json({ success: true })
// }