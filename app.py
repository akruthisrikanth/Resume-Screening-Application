from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import re

app = Flask(__name__)
CORS(app)

REQUIRED_SKILLS = {'python', 'machine learning', 'data analysis'}  # Adjust as needed
REQUIRED_YEARS = 3  # Adjust as needed

def extract_text_from_pdf(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        return ' '.join([page.extract_text() or '' for page in pdf.pages])

def extract_skills_and_experience(text):
    found_skills = {skill for skill in REQUIRED_SKILLS if skill.lower() in text.lower()}
    # Extract years of experience (simple version: matches e.g., '3 years', '5+ years')
    years_matches = re.findall(r'(\\d+)\\s*\\+?\\s*(?:years|yrs)', text, flags=re.I)
    years = int(max(years_matches, default=0))
    return found_skills, years

def calculate_score(found_skills, years):
    skill_match = len(found_skills) / len(REQUIRED_SKILLS)
    experience_match = min(years / REQUIRED_YEARS, 1)
    score = 0.7 * skill_match + 0.3 * experience_match
    return round(score * 100, 2)

@app.route('/upload', methods=['POST'])
def upload_resume():
    pdf = request.files['resume']
    text = extract_text_from_pdf(pdf)
    found_skills, years = extract_skills_and_experience(text)
    score = calculate_score(found_skills, years)
    return jsonify({
        'match_score': score,
        'skills_matched': list(found_skills),
        'years_experience': years
    })

if __name__ == '__main__':
    app.run(debug=True)
