from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")

stop_words = stopwords.words("english")


def clean_text(text):
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"\W", " ", text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)


def match_resume(resume_text, job_description):
    resume_clean = clean_text(resume_text)
    job_clean = clean_text(job_description)

    if not resume_clean.strip() or not job_clean.strip():
        return 0.0

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_clean, job_clean])
    similarity = cosine_similarity(vectors)[0][1]

    return round(similarity * 100, 2)