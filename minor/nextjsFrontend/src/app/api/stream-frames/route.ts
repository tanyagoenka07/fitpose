import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { writeFile } from "fs/promises"
import path from "path"
import fs from "fs/promises"

const execPromise = promisify(exec)

// This would be the path to your Python executable and script
const PYTHON_PATH = process.env.PYTHON_PATH || "python"
const SCRIPT_PATH = process.env.SCRIPT_PATH || "./ai_fitness_wrapper.py"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const frameData = data.frame // Base64 encoded frame
    const mode = data.mode || "Beginner"
    const sessionId = data.sessionId || process.env.PYTHON_SESSION_ID

    if (!frameData) {
      return NextResponse.json({ error: "No frame data provided" }, { status: 400 })
    }

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 })
    }

    // Create a temporary directory for the frame
    const framesDir = path.join(process.cwd(), "frames")
    await fs.mkdir(framesDir, { recursive: true })

    // Generate a unique filename
    const timestamp = new Date().getTime()
    const framePath = path.join(framesDir, `frame_${timestamp}.jpg`)

    // Convert base64 to buffer and save
    const frameBuffer = Buffer.from(frameData.replace(/^data:image\/\w+;base64,/, ""), "base64")
    await writeFile(framePath, frameBuffer)

    // Process the frame with the Python script
    const command = `${PYTHON_PATH} ${SCRIPT_PATH} process_frame --frame_path ${framePath} --mode ${mode} --session_id ${sessionId}`

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
    }

    // Parse the output to get the analysis results
    const result = JSON.parse(stdout)

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
    })
  } catch (error) {
    console.error("Error processing frame:", error)
    return NextResponse.json({ error: "Failed to process frame" }, { status: 500 })
  }
}

