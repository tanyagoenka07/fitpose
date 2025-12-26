import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

// This would be the path to your Python executable and script
const PYTHON_PATH = process.env.PYTHON_PATH || "python"
const SCRIPT_PATH = process.env.SCRIPT_PATH || "./ai_fitness_wrapper.py"

export async function POST() {
  try {
    // Get the session ID from the environment variable
    const sessionId = process.env.PYTHON_SESSION_ID

    if (!sessionId) {
      return NextResponse.json({ error: "No active recording session found" }, { status: 400 })
    }

    // Stop the Python script
    const command = `${PYTHON_PATH} ${SCRIPT_PATH} stop_live --session_id ${sessionId}`

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
    }

    // Parse the output to get the paths to the generated files
    const result = JSON.parse(stdout)

    // Store paths in environment variables for download routes
    if (result.report_path) {
      process.env.REPORT_PATH = result.report_path
    }

    if (result.video_path) {
      process.env.VIDEO_PATH = result.video_path
    }

    // Clear the session ID
    process.env.PYTHON_SESSION_ID = ""

    return NextResponse.json({
      success: true,
      message: "Recording stopped",
      reportPath: result.report_path,
      videoPath: result.video_path,
      stats: result.stats,
    })
  } catch (error) {
    console.error("Error stopping recording:", error)
    return NextResponse.json({ error: "Failed to stop recording" }, { status: 500 })
  }
}


