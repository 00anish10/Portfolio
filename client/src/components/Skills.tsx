import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchSkills } from '../api/client';
import type { Skill } from '../types';

const fallbackSkills: Skill[] = [
  { id: '1', name: 'TypeScript', category: 'Frontend', proficiency: 95, order: 1, created_at: '' },
  { id: '2', name: 'React', category: 'Frontend', proficiency: 92, order: 2, created_at: '' },
  { id: '3', name: 'Next.js', category: 'Frontend', proficiency: 88, order: 3, created_at: '' },
  { id: '4', name: 'Node.js', category: 'Backend', proficiency: 90, order: 1, created_at: '' },
  { id: '5', name: 'PostgreSQL', category: 'Backend', proficiency: 85, order: 2, created_at: '' },
  { id: '6', name: 'Python', category: 'Backend', proficiency: 80, order: 3, created_at: '' },
  { id: '7', name: 'Docker', category: 'DevOps', proficiency: 75, order: 1, created_at: '' },
  { id: '8', name: 'AWS', category: 'DevOps', proficiency: 70, order: 2, created_at: '' },
  { id: '9', name: 'Figma', category: 'Design', proficiency: 82, order: 1, created_at: '' },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills()
      .then(setSkills)
      .catch(() => setSkills(fallbackSkills));
  }, []);

  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">✦ My Skills</div>
          <h2 className="section-title">Technologies & Tools</h2>
          <p className="section-subtitle">
            A curated set of technologies I work with daily to build
            production-ready applications.
          </p>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              className="card skill-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(27,45,107,0.12)' }}
            >
              <div className="skill-category">{skill.category}</div>
              <div className="skill-card-header">
                <h3>{skill.name}</h3>
                <span>{skill.proficiency}%</span>
              </div>
              <div className="skill-bar">
                <motion.div
                  className="skill-bar-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + 0.05 * i, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
