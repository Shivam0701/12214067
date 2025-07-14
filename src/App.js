import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Shortener from './Shortener';
import Stats from './Stats';
import RedirectHandler from './RedirectHandler';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <header style={{ background: '#29144dff', padding: '15px 20px', color: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}><b>Mini URL</b></h1>
          <nav style={{ marginTop: 10 }}>
            <Link to="/" style={{ color: '#fff', marginRight: 15, textDecoration: 'underline' }}><i>Create</i></Link>
            <Link to="/stats" style={{ color: '#fff', textDecoration: 'underline' }}><i>Stats</i></Link>
          </nav>
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Shortener />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
