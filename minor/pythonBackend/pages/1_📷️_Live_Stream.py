import av
import os
import sys
import streamlit as st
from streamlit_webrtc import VideoHTMLAttributes, webrtc_streamer
from aiortc.contrib.media import MediaRecorder
from fpdf import FPDF
from datetime import datetime

# Define directory for storing reports
REPORTS_DIR = r"C:\Users\yashk\Desktop\updated minor"
os.makedirs(REPORTS_DIR, exist_ok=True)

BASE_DIR = os.path.abspath(os.path.join(__file__, '../../'))
sys.path.append(BASE_DIR)

from utils import get_mediapipe_pose
from process_frame import ProcessFrame
from thresholds import get_thresholds_beginner, get_thresholds_pro

st.title('AI Fitness Trainer: Squats Analysis')

mode = st.radio('Select Mode', ['Beginner', 'Pro'], horizontal=True)

thresholds = None 

if mode == 'Beginner':
    thresholds = get_thresholds_beginner()
elif mode == 'Pro':
    thresholds = get_thresholds_pro()

live_process_frame = ProcessFrame(thresholds=thresholds, flip_frame=True)
pose = get_mediapipe_pose()

if 'download' not in st.session_state:
    st.session_state['download'] = False

output_video_file = os.path.join(REPORTS_DIR, 'output_live.flv')

def video_frame_callback(frame: av.VideoFrame):
    frame = frame.to_ndarray(format="rgb24")  # Decode and get RGB frame
    frame, _ = live_process_frame.process(frame, pose)  # Process frame
    return av.VideoFrame.from_ndarray(frame, format="rgb24")  # Encode and return BGR frame

def out_recorder_factory() -> MediaRecorder:
    return MediaRecorder(output_video_file)

ctx = webrtc_streamer(
    key="Squats-pose-analysis",
    video_frame_callback=video_frame_callback,
    rtc_configuration={"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]},
    media_stream_constraints={"video": {"width": {'min':480, 'ideal':480}}, "audio": False},
    video_html_attrs=VideoHTMLAttributes(autoPlay=True, controls=False, muted=False),
    out_recorder_factory=out_recorder_factory
)

stop_button = st.button("Stop and Generate Report")

if stop_button:
    if os.path.exists(output_video_file):
        with open(output_video_file, 'rb') as op_vid:
            download = st.download_button('Download Video', data=op_vid, file_name='output_live.flv')
            if download:
                st.session_state['download'] = True

    # Generate PDF report
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="AI Fitness Trainer: Squats Analysis Report", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Mode: {mode}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Correct Squats: {live_process_frame.state_tracker['SQUAT_COUNT']}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Incorrect Squats: {live_process_frame.state_tracker['IMPROPER_SQUAT']}", ln=True, align='C')
    pdf.cell(200, 10, txt="Feedback and Improvements:", ln=True, align='C')
    pdf.multi_cell(0, 10, txt="1. Ensure your knees do not go over your toes.\n2. Keep your back straight.\n3. Lower your hips properly.\n4. Avoid deep squats if not necessary.")

    pdf_output = os.path.join(REPORTS_DIR, "squats_report.pdf")
    pdf.output(pdf_output)

    with open(pdf_output, "rb") as f:
        st.download_button("Download Report", f, file_name="squats_report.pdf")

if os.path.exists(output_video_file) and st.session_state['download']:
    os.remove(output_video_file)
    st.session_state['download'] = False
