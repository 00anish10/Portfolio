export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-logo">Portfolio</div>
            <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <ul className="footer-links">
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="mailto:hello@anish.dev">Email</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
