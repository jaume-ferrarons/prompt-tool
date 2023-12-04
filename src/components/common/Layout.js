// src/components/common/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>AI Tool</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
