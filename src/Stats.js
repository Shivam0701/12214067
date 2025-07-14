import React, { useEffect, useState } from 'react';

function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    setData(stored);
  }, []);

  return (
    <div>
      <h2>📊 Your Link Stats</h2>
      {data.length === 0 && <p>No links found.</p>}
      {data.map((item, i) => (
        <div key={i} style={{ background: '#f0f0f0', padding: 10, marginBottom: 10 }}>
          <p><strong>Short:</strong> <a href={`/${item.shortcode}`}>{window.location.origin}/{item.shortcode}</a></p>
          <p><strong>Original:</strong> {item.url}</p>
          <p><strong>Clicks:</strong> {item.clicks?.length || 0}</p>
          <p><strong>Expires:</strong> {new Date(item.expires).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Stats;