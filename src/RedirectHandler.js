import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RedirectHandler() {
  const { shortcode } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    const match = stored.find(l => l.shortcode === shortcode);
    if (!match) {
      setStatus('not-found');
      return;
    }
    if (Date.now() > match.expires) {
      setStatus('expired');
      return;
    }
    match.clicks.push({ timestamp: Date.now(), source: document.referrer });
    const updated = stored.map(l => l.shortcode === shortcode ? match : l);
    localStorage.setItem('shortLinks', JSON.stringify(updated));
    setTimeout(() => {
      window.location.href = match.url;
    }, 1000);
  }, [shortcode]);

  if (status === 'loading') return <p>Redirecting...</p>;
  if (status === 'not-found') return <p>❌ Link not found</p>;
  if (status === 'expired') return <p>⚠️ This link has expired</p>;

  return null;
}

export default RedirectHandler;
