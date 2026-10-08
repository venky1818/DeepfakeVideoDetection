from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

from predict import predict_video

app = Flask(__name__)
CORS(app)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {"mp4", "avi", "mov", "mkv", "webm"}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# --------------------------------
# HOME / BACKEND TEST
# --------------------------------

@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Deepfake Video Detection API is running"
    })


# --------------------------------
# BACKEND CONNECTION TEST
# --------------------------------

@app.route("/api/test")
def test():
    return jsonify({
        "status": "success",
        "message": "Backend connection is working"
    })


# --------------------------------
# REGISTER
# --------------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No registration data received"
        }), 400

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({
            "status": "error",
            "message": "All fields are required"
        }), 400

    return jsonify({
        "status": "success",
        "message": "Registration successful"
    })


# --------------------------------
# LOGIN
# --------------------------------

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "No login data received"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required"
        }), 400

    # Temporary login for testing
    return jsonify({
        "status": "success",
        "message": "Login successful"
    })


# --------------------------------
# VIDEO DEEPFAKE DETECTION
# --------------------------------

@app.route("/api/detect/video", methods=["POST"])
def detect_video():

    # Check whether video was sent
    if "video" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No video file received"
        }), 400

    video = request.files["video"]

    # Check filename
    if video.filename == "":
        return jsonify({
            "status": "error",
            "message": "No video selected"
        }), 400

    # Check video format
    if not allowed_file(video.filename):
        return jsonify({
            "status": "error",
            "message": "Unsupported video format"
        }), 400

    # Secure filename
    filename = secure_filename(video.filename)

    # Save video
    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

# Save uploaded video
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    video.save(filepath)

    # --------------------------------
    # ACTUAL AI MODEL PREDICTION
    # --------------------------------

    try:
        prediction = predict_video(filepath)

        result = prediction["result"]
        confidence = prediction["confidence"]
        frames = prediction["frames"]

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Video analysis failed",
            "error": str(e)
        }), 500

    return jsonify({
        "status": "success",
        "message": "Video uploaded and analyzed successfully",
        "filename": filename,
        "result": result,
        "confidence": confidence,
        "frames": frames
    })
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True, use_reloader=False)
   