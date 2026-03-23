const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  password: 'newpassword123',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

async function check() {
  try {
    const res = await pool.query("SELECT * FROM csquare_users WHERE email = 'admin@csquare.com'");
    if (res.rows.length === 0) {
      console.log('Admin not found in DB');
      return;
    }
    const user = res.rows[0];
    console.log('User found:', user.email, user.password);
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('Password match?', isMatch);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
