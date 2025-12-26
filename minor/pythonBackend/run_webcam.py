import cv2
from process_frame import ProcessFrame
import mediapipe as mp

# Initialize Pose and ProcessFrame
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Thresholds dict as required
thresholds = {
    'OFFSET_THRESH': 15,
    'INACTIVE_THRESH': 7.0,
    'HIP_KNEE_VERT': {
        'NORMAL': (70, 110),
        'TRANS': (40, 69),
        'PASS': (10, 39)
    }
}

# Create instance
process_frame = ProcessFrame(thresholds)

# Start webcam
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip frame if needed
    if process_frame.flip_frame:
        frame = cv2.flip(frame, 1)

    # Convert to RGB (as required by mediapipe)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Pass through existing process() function
    output_frame = process_frame.process(rgb_frame, pose)

    # Show output
    cv2.imshow("Live Posture Feedback", output_frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release
cap.release()
cv2.destroyAllWindows()
