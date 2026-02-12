from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import docx2txt, PyPDF2

app = Flask(__name__)

@app.route("/parse_resume", methods=["POST"])
def parse_resume():
    file = request.files['resume']
    content = ""
    if file.filename.endswith(".pdf"):
        import io
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            content += page.extract_text()
    elif file.filename.endswith(".docx"):
        content = docx2txt.process(file)
    
    job_desc = request.form.get("job_desc", "")
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([content, job_desc])
    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

    return jsonify({"score": score})

if __name__ == "__main__":
    app.run(port=8001)
