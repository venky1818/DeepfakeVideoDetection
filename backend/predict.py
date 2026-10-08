import os
import cv2
import numpy as np
import tensorflow as tf
import base64





# ==============================
# MODEL SETTINGS
# ==============================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model",
    "deepfake_model.keras"
)

IMAGE_SIZE = (160, 160)
SEQUENCE_LENGTH = 20

# Load trained model
model = tf.keras.models.load_model(MODEL_PATH)
print("MODEL INPUT SHAPE:",
      model.input_shape)

print("Deepfake model loaded successfully!")


# ==============================
# EXTRACT 10 FRAMES FROM VIDEO
# ==============================

def extract_video_frames(video_path):

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Unable to open video")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames <= 0:
        cap.release()
        raise ValueError("Video contains no frames")

    # Select 10 equally spaced frames
    frame_indices = np.linspace(
        0,
        total_frames - 1,
        SEQUENCE_LENGTH,
        dtype=int
    )

    frames = []

    for frame_index in frame_indices:

        cap.set(cv2.CAP_PROP_POS_FRAMES, int(frame_index))

        success, frame = cap.read()

        if not success:
            continue

        # OpenCV uses BGR → convert to RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Resize exactly like training
        frame = cv2.resize(frame, IMAGE_SIZE)

        # Convert to float
        frame = frame.astype(np.float32)
        frame = frame/255.0

    

        frames.append(frame)

    cap.release()

    if len(frames) == 0:
        raise ValueError("Could not extract frames from video")

    # If fewer than 10 frames were obtained,
    # repeat the last frame
    while len(frames) < SEQUENCE_LENGTH:
        frames.append(frames[-1].copy())

    # Keep exactly 10 frames
    frames = frames[:SEQUENCE_LENGTH]

    return np.array(frames, dtype=np.float32)



# ==============================
# PREDICT VIDEO
# ==============================

def frame_to_base64(frame):
    frame_uint8 = (frame * 255).astype(np.uint8)

    frame_bgr = cv2.cvtColor(
        frame_uint8,
        cv2.COLOR_RGB2BGR
    )

    success, buffer = cv2.imencode(".jpg", frame_bgr)

    if not success:
        return None

    return base64.b64encode(buffer).decode("utf-8")

def predict_video(video_path):

    frames = extract_video_frames(video_path)
    
    frame_images = []

    for frame in frames[:10]:
        encoded_frame = frame_to_base64(frame)

        if encoded_frame:
            
            frame_images.append(encoded_frame)
    

    # Model expects:
    # (batch, 10, 160, 160, 3)

    input_data = np.expand_dims(frames, axis=0)

    prediction = model.predict(input_data, verbose=0)

    probability = float(prediction[0][0])
    
    print("MODEL PROBABILITY:",probability)

    # Training labels:
    # 0 = REAL
    # 1 = FAKE

    if probability >= 0.5:
        result = "FAKE"
        confidence = probability * 100
    else:
        result = "REAL"
        confidence = (1 - probability) * 100

    return {
        "result": result,
        "confidence": round(confidence, 2),
        "probability": round(probability, 4),
        "frames":frame_images
    }