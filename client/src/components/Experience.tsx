import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchExperience } from '../api/client';
import type { Experience as ExperienceType } from '../types';

const fallbackExperience: ExperienceType[] = [
  {
    id: '1',
    company: 'Tech Corp',
    role: 'Senior Software Engineer',
    start_date: '2022-03-01',
    end_date: null,
    description: 'Leading frontend architecture for the main product. Mentoring junior developers and driving adoption of TypeScript across the team.',
    order: 1,
    created_at: '',
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Full Stack Developer',
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    description: 'Built the core platform from the ground up using React and Node.js. Implemented CI/CD pipelines and automated testing.',
    order: 2,
    created_at: '',
  },
  {
    id: '3',
    company: 'Digital Agency',
    role: 'Junior Developer',
    start_date: '2018-09-01',
    end_date: '2020-05-31',
    description: 'Developed responsive web applications for diverse clients. Collaborated on REST API design and database schema planning.',
    order: 3,
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
            My professional journey building products and leading teams.
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
