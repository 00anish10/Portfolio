import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchExperience } from '../api/client';
import type { Experience as ExperienceType } from '../types';

const fallbackExperience: ExperienceType[] = [
  {
    id: '1',
    company: 'MedicSewa Pvt. Ltd.',
    role: 'Full Stack Developer',
    start_date: '2024-01-01',
    end_date: null,
    description: 'Architect and implement full-stack web solutions using React.js and Node.js. Collaborate closely with UI/UX designers to create intuitive user interfaces. Design and optimize RESTful APIs for seamless data flow. Manage and optimize MySQL databases for improved performance. Implement responsive designs ensuring cross-device compatibility.',
    order: 1,
    created_at: '',
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceType[]>([]);

  useEffect(() => {
    fetchExperience()
      .then(setExperience)
      .catch(() => setExperience(fallbackExperience));
  }, []);

  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">✦ Experience</div>
          <h2 className="section-title">Where I've Worked</h2>
          <p className="section-subtitle">
            My professional journey building full-stack web applications.
          </p>
        </motion.div>

        <div className="timeline">
          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="date">
                {formatDate(item.start_date)} —{' '}
                {item.end_date ? formatDate(item.end_date) : 'Present'}
              </div>
              <div className="role">{item.role}</div>
              <div className="company">{item.company}</div>
              <p className="description">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
