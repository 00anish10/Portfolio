import pool from './pool';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`DELETE FROM skills a USING skills b WHERE a.id > b.id AND a.name = b.name;`);
    await client.query(`DELETE FROM projects a USING projects b WHERE a.id > b.id AND a.title = b.title;`);
    await client.query(`DELETE FROM experience a USING experience b WHERE a.id > b.id AND a.company = b.company AND a.role = b.role;`);

    await client.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_title_key') THEN ALTER TABLE projects ADD CONSTRAINT projects_title_key UNIQUE (title); END IF; END $$;`);
    await client.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'skills_name_key') THEN ALTER TABLE skills ADD CONSTRAINT skills_name_key UNIQUE (name); END IF; END $$;`);
    await client.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experience_company_role_key') THEN ALTER TABLE experience ADD CONSTRAINT experience_company_role_key UNIQUE (company, role); END IF; END $$;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL UNIQUE,
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
        name VARCHAR(255) NOT NULL UNIQUE,
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
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (company, role)
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
      INSERT INTO projects (title, description, tech_stack, featured, "order")
      SELECT 'E-Commerce Platform', 'A full-featured online store built with React and Node.js, featuring real-time inventory management and secure payment processing.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], true, 1
      WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'E-Commerce Platform');
    `);
    await client.query(`
      INSERT INTO projects (title, description, tech_stack, featured, "order")
      SELECT 'Task Management App', 'Collaborative project management tool with real-time updates, drag-and-drop boards, and team analytics.', ARRAY['TypeScript', 'Next.js', 'Prisma', 'WebSocket'], true, 2
      WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Task Management App');
    `);
    await client.query(`
      INSERT INTO projects (title, description, tech_stack, featured, "order")
      SELECT 'Weather Dashboard', 'Interactive weather visualization dashboard with 7-day forecasts, historical data charts, and location-based alerts.', ARRAY['React', 'D3.js', 'Express', 'Redis'], true, 3
      WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Weather Dashboard');
    `);

    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'TypeScript', 'Frontend', 95, 1
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'TypeScript');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'React', 'Frontend', 92, 2
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'React');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'Next.js', 'Frontend', 88, 3
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Next.js');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'Node.js', 'Backend', 90, 1
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Node.js');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'PostgreSQL', 'Backend', 85, 2
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'PostgreSQL');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'Python', 'Backend', 80, 3
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Python');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'Docker', 'DevOps', 75, 1
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Docker');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'AWS', 'DevOps', 70, 2
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'AWS');
    `);
    await client.query(`
      INSERT INTO skills (name, category, proficiency, "order")
      SELECT 'Figma', 'Design', 82, 1
      WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Figma');
    `);

    await client.query(`
      INSERT INTO experience (company, role, start_date, end_date, description, "order")
      SELECT 'Tech Corp', 'Senior Software Engineer', '2022-03-01', NULL, 'Leading frontend architecture for the main product. Mentoring junior developers and driving adoption of TypeScript across the team.', 1
      WHERE NOT EXISTS (SELECT 1 FROM experience WHERE company = 'Tech Corp' AND role = 'Senior Software Engineer');
    `);
    await client.query(`
      INSERT INTO experience (company, role, start_date, end_date, description, "order")
      SELECT 'StartupXYZ', 'Full Stack Developer', '2020-06-01', '2022-02-28', 'Built the core platform from the ground up using React and Node.js. Implemented CI/CD pipelines and automated testing.', 2
      WHERE NOT EXISTS (SELECT 1 FROM experience WHERE company = 'StartupXYZ' AND role = 'Full Stack Developer');
    `);
    await client.query(`
      INSERT INTO experience (company, role, start_date, end_date, description, "order")
      SELECT 'Digital Agency', 'Junior Developer', '2018-09-01', '2020-05-31', 'Developed responsive web applications for diverse clients. Collaborated on REST API design and database schema planning.', 3
      WHERE NOT EXISTS (SELECT 1 FROM experience WHERE company = 'Digital Agency' AND role = 'Junior Developer');
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
