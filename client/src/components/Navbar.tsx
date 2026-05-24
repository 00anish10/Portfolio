import { motion } from 'framer-motion';

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <motion.a
          href="#hero"
          className="navbar-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Portfolio
        </motion.a>
        <ul className="navbar-links">
          {links.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <a href={link.href}>{link.label}</a>
            </motion.li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
