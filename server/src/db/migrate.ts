import pool from './pool';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        live_url VARCHAR(500),
        repo_url VARCHAR(500),
        tech_stack TEXT[] NOT NULL DEFAULT '{}',
        featured BOOLEAN NOT NULL DEFAULT false,
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Other',
        proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      INSERT INTO projects (title, description, tech_stack, featured, "order") VALUES
        ('E-Commerce Platform', 'A full-featured online store built with React and Node.js, featuring real-time inventory management and secure payment processing.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], true, 1),
        ('Task Management App', 'Collaborative project management tool with real-time updates, drag-and-drop boards, and team analytics.', ARRAY['TypeScript', 'Next.js', 'Prisma', 'WebSocket'], true, 2),
        ('Weather Dashboard', 'Interactive weather visualization dashboard with 7-day forecasts, historical data charts, and location-based alerts.', ARRAY['React', 'D3.js', 'Express', 'Redis'], true, 3)
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order") VALUES
        ('TypeScript', 'Frontend', 95, 1),
        ('React', 'Frontend', 92, 2),
        ('Next.js', 'Frontend', 88, 3),
        ('Node.js', 'Backend', 90, 1),
        ('PostgreSQL', 'Backend', 85, 2),
        ('Python', 'Backend', 80, 3),
        ('Docker', 'DevOps', 75, 1),
        ('AWS', 'DevOps', 70, 2),
        ('Figma', 'Design', 82, 1)
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO experience (company, role, start_date, end_date, description, "order") VALUES
        ('Tech Corp', 'Senior Software Engineer', '2022-03-01', NULL, 'Leading frontend architecture for the main product. Mentoring junior developers and driving adoption of TypeScript across the team.', 1),
        ('StartupXYZ', 'Full Stack Developer', '2020-06-01', '2022-02-28', 'Built the core platform from the ground up using React and Node.js. Implemented CI/CD pipelines and automated testing.', 2),
        ('Digital Agency', 'Junior Developer', '2018-09-01', '2020-05-31', 'Developed responsive web applications for diverse clients. Collaborated on REST API design and database schema planning.', 3)
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
