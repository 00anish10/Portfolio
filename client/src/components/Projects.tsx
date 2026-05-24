import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchFeaturedProjects } from '../api/client';
import type { Project } from '../types';

const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured online store built with React and Node.js, featuring real-time inventory management and secure payment processing.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    featured: true,
    order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, drag-and-drop boards, and team analytics.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['TypeScript', 'Next.js', 'Prisma', 'WebSocket'],
    featured: true,
    order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Interactive weather visualization dashboard with 7-day forecasts, historical data charts, and location-based alerts.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['React', 'D3.js', 'Express', 'Redis'],
    featured: true,
    order: 3,
    created_at: '',
    updated_at: '',
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchFeaturedProjects()
      .then(setProjects)
      .catch(() => setProjects(fallbackProjects));
  }, []);

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">✦ My Work</div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of projects I've built. Each is a testament to
            thoughtful design and clean code.
          </p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="card project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(27,45,107,0.12)' }}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech_stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    Live Demo ↗
                  </a>
                )}
                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                    Source Code ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
