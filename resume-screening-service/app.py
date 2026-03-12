from flask import Flask, request, jsonify
from resume_parser import extract_text
from matcher import match_resume
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/match", methods=["POST"])
def match():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume = request.files["resume"]
        job_desc = request.form.get("job", "")

        if not resume.filename:
            return jsonify({"error": "Invalid resume file"}), 400

        filename = secure_filename(resume.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        resume.save(file_path)

        resume_text = extract_text(file_path)
        score = match_resume(resume_text, job_desc)

        if score > 70:
            result = "Selected"
        elif 30 <= score <= 70:
            result = "Processing"
        else:
            result = "Rejected"

        return jsonify({
            "match_score": score,
            "result": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)