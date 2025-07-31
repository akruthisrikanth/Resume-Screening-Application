import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: 'Upload failed' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: 20, background: '#f9fafb', borderRadius: 12 }}>
      <h2>Resume Screening App</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
        <button type="submit" style={{ marginLeft: 10 }} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 18 }}>
          {result.error ? (
            <div style={{ color: 'red' }}>{result.error}</div>
          ) : (
            <>
              <div><b>Match Score:</b> {result.match_score}%</div>
              <div><b>Skills Matched:</b> {result.skills_matched.join(', ') || 'None'}</div>
              <div><b>Years Experience Detected:</b> {result.years_experience}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
