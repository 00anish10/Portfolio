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
            <li><a href="https://github.com/00anish10" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/anish-shrestha-b79960343" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="mailto:anishshrestha2007@gmail.com">Email</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
