import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

// This would be the path to your Python executable and script
const PYTHON_PATH = process.env.PYTHON_PATH || "python"
const SCRIPT_PATH = process.env.SCRIPT_PATH || "./ai_fitness_wrapper.py"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const mode = data.mode || "Beginner"

    // Start the Python script in live streaming mode
    const command = `${PYTHON_PATH} ${SCRIPT_PATH} start_live --mode ${mode}`

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
    }

    // Parse the output to get the session ID
    const result = JSON.parse(stdout)

    // Store the session ID for later use
    process.env.PYTHON_SESSION_ID = result.session_id

    return NextResponse.json({
      success: true,
      message: "Recording started",
      sessionId: result.session_id,
    })
  } catch (error) {
    console.error("Error starting recording:", error)
    return NextResponse.json({ error: "Failed to start recording" }, { status: 500 })
  }
}
// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   const data = await request.json()

//   // This would call your Python backend to start recording
//   // In a real implementation, you would use something like child_process.spawn
//   // to run your Python script with the appropriate parameters

//   console.log("Starting recording with mode:", data.mode)

//   return NextResponse.json({ success: true })
// }
