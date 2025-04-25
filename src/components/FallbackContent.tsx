
import React from 'react';
import { navLinks } from '@/utils/seo';

const FallbackContent: React.FC = () => {
  return (
    <div className="fallback-content">
      <header className="site-header">
        <nav>
          <div className="logo-container">
            <a href="/" aria-label="MeowRescue Home">
              <img src="/images/meow-rescue-logo.jpg" alt="MeowRescue Logo" width="80" height="80" />
              <span>MeowRescue</span>
            </a>
          </div>
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.url}>
                <a href={link.url}>{link.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <h1>Meow Rescue - Cat Adoption & Foster Care</h1>
        <p>Welcome to Meow Rescue, a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.</p>
        <h2>Our Mission</h2>
        <p>We believe every cat deserves a loving, forever home. Our mission is to rescue cats from high-risk situations, provide necessary medical care, and find them loving homes.</p>
      </main>
      <footer>
        <div className="footer-links">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              {navLinks.map(link => (
                <li key={link.url}>
                  <a href={link.url}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Information</h3>
            <p>Email: info@meowrescue.org</p>
            <p>Phone: (727) 257-0037</p>
            <div className="social-links">
              <a href="https://facebook.com/meowrescue" target="_blank" rel="noopener">Facebook</a>
              <a href="https://instagram.com/meowrescue" target="_blank" rel="noopener">Instagram</a>
              <a href="https://twitter.com/meowrescue" target="_blank" rel="noopener">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Meow Rescue Network, Inc. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FallbackContent;
