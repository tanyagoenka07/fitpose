from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi import Form
from io import BytesIO
from datetime import datetime
import os
import numpy as np
from pathlib import Path
from fpdf import FPDF
import cv2
import tempfile
import av
from av import VideoFrame
import resend
import base64
from io import BytesIO
from dotenv import load_dotenv
load_dotenv()
from PIL import Image
import shutil
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Imports for analysis logic
from process_frame import ProcessFrame
from utils import get_mediapipe_pose
from thresholds import get_thresholds_beginner

app = FastAPI()

# Directory setup
BACKEND_DIR = Path(__file__).parent
REPORTS_DIR = BACKEND_DIR / "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

# Default setup
thresholds = get_thresholds_beginner()
live_process_frame = ProcessFrame(thresholds=thresholds, flip_frame=True)
pose = get_mediapipe_pose()
output_video_file = str(REPORTS_DIR / 'output_live.flv')

# Resend API Key setup
resend.api_key = os.environ["RESEND_API_KEY"]


#  /analyze: Handles full video uploads
# Setup logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """
    Handles full video upload and returns the processed video with feedback.
    """
    try:
        logger.info("Received video for analysis.")
        
        # Read the uploaded file
        contents = await file.read()
        video_bytes = BytesIO(contents)
        container = av.open(video_bytes)

        # Output file path for processed video
        output_video_path = str(REPORTS_DIR / 'processed_video.mp4')
        out_container = av.open(output_video_path, mode='w', format='mp4')

        # Get video stream and frame rate (fallback to 30 if missing)
        video_stream = container.streams.video[0]
        frame_rate = video_stream.average_rate if hasattr(video_stream, 'average_rate') else 30
        
        logger.info("Processing video frames...")

        # Create the output stream with the fallback frame rate
        out_stream = out_container.add_stream('libx264', frame_rate)

        for frame in container.decode(video=0):
            np_frame = frame.to_ndarray(format="rgb24")  # Convert to numpy array

            # Process the numpy array frame (ensure the processing function works with numpy arrays)
            processed_frame, feedback = live_process_frame.process(np_frame, pose)

            # Convert the processed numpy array back to VideoFrame
            processed_video_frame = VideoFrame.from_ndarray(processed_frame, format='rgb24')

            # Encode the frame back to video format
            out_container.mux(out_stream.encode(processed_video_frame))

        out_container.close()

        logger.info(f"Processed video saved to: {output_video_path}")

        with open(output_video_path, "rb") as f:
           encoded_video = base64.b64encode(f.read()).decode("utf-8")
        
        # Send email with the report (using a hardcoded email address)
        params = {
            "from": "Acme <onboarding@resend.dev>",
            "to": "siddh907729@gmail.com",  # Hardcoded email
            "subject": "Squats Analysis Report Generated",
            "html": "<strong>Attached is your detailed squat analysis video.</strong>",
            "attachments": [
                {
                    "filename": "squat_analysis_video.mp4",
                    "content": encoded_video,
                    "type": "video/mp4"
                }
            ]
        }

        # Sending the email
        email = resend.Emails.send(params)
        logger.info(f"Email sent to hardcoded email with video attached: {email}")

        # Return the processed video to the frontend
        return StreamingResponse(open(output_video_path, "rb"), media_type="video/mp4", headers={
            "Content-Disposition": "attachment; filename=processed_video.mp4"
        })

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return JSONResponse(content={"error": f"Analysis failed: {str(e)}"}, status_code=500)

class FrameData(BaseModel):
    imageBase64: str

def process_frame(frame):
    """
    Process the given frame and provide feedback. Includes image processing techniques such as 
    edge detection and face detection, along with feedback generation.
    """
    try:
        # Convert frame to grayscale
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Example of edge detection using Canny
        edges = cv2.Canny(gray_frame, threshold1=100, threshold2=200)

        # Detect faces using Haar Cascade (you can replace this with your model inference)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray_frame, 1.1, 4)
        
        # Draw rectangles around detected faces (for visualization purposes)
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        # Prepare the feedback message
        feedback = "Frame processed successfully."

        # Example feedback based on edge detection
        if np.any(edges):
            feedback += " Edges detected in the frame."
        else:
            feedback += " No edges detected."

        # Example feedback based on face detection
        if len(faces) > 0:
            feedback += f" {len(faces)} face(s) detected."
        else:
            feedback += " No faces detected."

        logging.info("Feedback: %s", feedback)
        
        # Return the feedback
        return feedback
    
    except Exception as e:
        logging.error(f"Error in processing frame: {e}")
        return "Error processing frame"

@app.post("/livefeed")
async def analyze_live(data: FrameData):
    try:
       
        logging.info(f"Received base64 data: {data.imageBase64[:100]}...")

        
        base64_str = data.imageBase64
        if base64_str.startswith("data:image/"):
            # Decode the image data (remove the prefix before decoding)
            image_data = base64.b64decode(base64_str.split(",")[1])
        else:
            raise ValueError("Invalid base64 image data format.")

        
        image = Image.open(BytesIO(image_data))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        
        feedback = process_frame(frame)

        return {"success": True, "feedback": feedback}

    except Exception as e:
        logging.error(f"Error during live frame analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Live analysis failed.")


@app.post("/upload_frame/")
async def upload_frame(file: UploadFile = File(...)):
    """
    Handle single frame uploads for processing.
    """
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Process the frame and return feedback
        _processed_frame, feedback = live_process_frame.process(rgb_frame, pose)
        return {"status": "success", "feedback": feedback}
    except Exception as e:
        logging.error(f"Error processing frame: {str(e)}")
        return {"error": f"Failed to process frame: {str(e)}"}

@app.post("/start_live_stream/")
async def start_live_stream():
    """
    Placeholder endpoint to trigger the start of a live stream.
    """
    return {"status": "Live stream started."}

@app.post("/stop_and_generate_report/")
async def stop_and_generate_report():
    """
    Generate PDF report from current state.
    """
    try:
        if "SQUAT_COUNT" not in live_process_frame.state_tracker:
            return {"error": "No frames processed yet."}

        # Create PDF from the processed frame data
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="AI Fitness Trainer: Squats Analysis Report", ln=True, align='C')
        pdf.cell(200, 10, txt=f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.cell(200, 10, txt="Mode: Beginner", ln=True, align='C')
        pdf.cell(200, 10, txt=f"Correct Squats: {live_process_frame.state_tracker['SQUAT_COUNT']}", ln=True, align='C')
        pdf.cell(200, 10, txt=f"Incorrect Squats: {live_process_frame.state_tracker['IMPROPER_SQUAT']}", ln=True, align='C')
        pdf.multi_cell(0, 10, txt="\n".join(live_process_frame.generate_feedback()))

        report_path = REPORTS_DIR / "squats_report.pdf"
        pdf.output(str(report_path))

        return StreamingResponse(open(report_path, "rb"), media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=squats_report.pdf"
        })
    except Exception as e:
        logging.error(f"Error generating report: {str(e)}")
        return {"error": f"Failed to generate report: {str(e)}"}

@app.get("/download_video/")
async def download_video():
    """
    Provide the processed video for download.
    """
    try:
        if not os.path.exists(output_video_file):
            return {"error": "Processed video not found."}
        
        # Stream the video file
        return StreamingResponse(open(output_video_file, "rb"), media_type="video/mp4", headers={
            "Content-Disposition": "attachment; filename=output_live.flv"
        })
    except Exception as e:
        logging.error(f"Error downloading video: {str(e)}")
        return {"error": f"Failed to download video: {str(e)}"}

