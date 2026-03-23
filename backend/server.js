const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcsquarekey123';

// Initialize DB Table
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                club_uid VARCHAR(100),
                role VARCHAR(20) DEFAULT 'member'
            );
        `);
        console.log('Users table ensured.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date VARCHAR(100) NOT NULL,
                time VARCHAR(100),
                mode VARCHAR(50),
                location VARCHAR(255),
                image_url TEXT,
                tags TEXT[],
                status VARCHAR(50) DEFAULT 'Upcoming',
                is_starred BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Events table ensured.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_members (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                track VARCHAR(50),
                role VARCHAR(50) DEFAULT 'Member',
                batch VARCHAR(20),
                github VARCHAR(255),
                linkedin VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Pending',
                eventsAttended INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Members table ensured.');

        // Initialize Projects Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_projects (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                leader VARCHAR(100),
                theme VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Pending',
                deadline TIMESTAMP,
                repo VARCHAR(255),
                progress INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Projects table ensured.');

        // Initialize Team Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_team (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100) DEFAULT 'Member',
                email VARCHAR(100),
                phone VARCHAR(20),
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Team table ensured.');

        // Initialize Tasks Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                assignee VARCHAR(100),
                priority VARCHAR(50) DEFAULT 'Medium',
                status VARCHAR(50) DEFAULT 'Todo',
                due TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tasks table ensured.');

        // Initialize CMS Highlights Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_cms_highlights (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                "desc" TEXT,
                active BOOLEAN DEFAULT true,
                emoji VARCHAR(20)
            );
        `);
        console.log('CMS Highlights table ensured.');

        // Initialize CMS Resources Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_cms_resources (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                type VARCHAR(100),
                link VARCHAR(255),
                featured BOOLEAN DEFAULT false
            );
        `);
        console.log('CMS Resources table ensured.');

        // Initialize CMS Stories Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_cms_stories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                batch VARCHAR(50),
                achievement TEXT,
                rating INTEGER DEFAULT 5,
                text TEXT
            );
        `);
        console.log('CMS Stories table ensured.');

        // Initialize CMS Blog Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS csquare_cms_blog (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Draft',
                views INTEGER DEFAULT 0,
                category VARCHAR(100)
            );
        `);
        console.log('CMS Blog table ensured.');

        // Seed admin user if it doesn't exist
        const adminCheck = await pool.query("SELECT * FROM csquare_users WHERE email = 'admin@csquare.com'");
        if (adminCheck.rows.length === 0) {
            const hashedAdminPass = await bcrypt.hash('admin123', 10);
            await pool.query(
                "INSERT INTO csquare_users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                ['Super Admin', 'admin@csquare.com', hashedAdminPass, 'admin']
            );
            console.log('Default Admin created (admin@csquare.com / admin123)');
        }
    } catch (err) {
        console.error('Error initializing DB:', err);
    }
};

initDB();

// Register Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, club_uid } = req.body;

        if (!name || !email || !password || !club_uid) {
            return res.status(400).json({ error: 'All fields are required, including Club UID' });
        }

        const userExists = await pool.query('SELECT * FROM csquare_users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO csquare_users (name, email, password, club_uid, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, club_uid, 'member']
        );

        // SYNC: Push the registered user instantly into the Pending Members queue of the Dashboard
        await pool.query(
            'INSERT INTO csquare_members (name, email, role, status) VALUES ($1, $2, $3, $4)',
            [name, email, 'Member', 'Pending']
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing fields in request body. Email:", email, "Password:", password ? "Provided" : "Missing");
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        console.log(`Login attempt for email: ${email}`);
        const userResult = await pool.query('SELECT * FROM csquare_users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            console.log(`User not found for email: ${email}`);
            return res.status(400).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];
        console.log(`User found. Hash in DB: ${user.password}`);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result for ${email}: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ error: 'Wrong password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to check Admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// --- SYSTEM USERS API (MANAGE ADMINS) ---

// Get all users
app.get('/api/users', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, club_uid, role FROM csquare_users ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new user (useful to add new admins bypassing registration page constraints)
app.post('/api/users', isAdmin, async (req, res) => {
    const { name, email, password, club_uid, role } = req.body;
    try {
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
        
        const userExists = await pool.query('SELECT * FROM csquare_users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO csquare_users (name, email, password, club_uid, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, club_uid, role || 'member']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user role or details
app.put('/api/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, club_uid, role } = req.body;
    try {
        const check = await pool.query('SELECT * FROM csquare_users WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const current = check.rows[0];
        const result = await pool.query(
            'UPDATE csquare_users SET name = $1, email = $2, club_uid = $3, role = $4 WHERE id = $5 RETURNING id, name, email, role',
            [name || current.name, email || current.email, club_uid || current.club_uid, role || current.role, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
app.delete('/api/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM csquare_users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- EVENTS API ---

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_events ORDER BY is_starred DESC, created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get recent events (top 4 recent)
app.get('/api/events/featured', async (req, res) => {
    try {
        // Get 4 most recent events
        const result = await pool.query('SELECT * FROM csquare_events ORDER BY created_at DESC LIMIT 4');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create event (Admin only)
app.post('/api/events', isAdmin, async (req, res) => {
    const { title, date, time, mode, location, image_url, tags, status, is_starred } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO csquare_events 
            (title, date, time, mode, location, image_url, tags, status, is_starred) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, date, time, mode, location, image_url, tags || [], status || 'Upcoming', is_starred || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update event (Admin only)
app.put('/api/events/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, date, time, mode, location, image_url, tags, status, is_starred } = req.body;
    
    try {
        // If just toggling star, only update is_starred
        if (Object.keys(req.body).length === 1 && req.body.is_starred !== undefined) {
             const result = await pool.query(
                'UPDATE csquare_events SET is_starred = $1 WHERE id = $2 RETURNING *',
                [req.body.is_starred, id]
            );
            return res.json(result.rows[0]);
        }

        const result = await pool.query(
            `UPDATE csquare_events 
            SET title = $1, date = $2, time = $3, mode = $4, location = $5, image_url = $6, tags = $7, status = $8, is_starred = $9 
            WHERE id = $10 RETURNING *`,
            [title, date, time, mode, location, image_url, tags, status, is_starred, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete event (Admin only)
app.delete('/api/events/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM csquare_events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- MEMBERS API ---

// Get all members
app.get('/api/members', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_members ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single member
app.get('/api/members/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_members WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create member (Admin only)
app.post('/api/members', isAdmin, async (req, res) => {
    const { name, email, phone, track, role, batch, github, linkedin, status, eventsAttended } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO csquare_members 
            (name, email, phone, track, role, batch, github, linkedin, status, eventsAttended) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, email, phone, track, role || 'Member', batch, github, linkedin, status || 'Pending', eventsAttended || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update member (Admin only)
app.put('/api/members/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, track, role, batch, github, linkedin, status, eventsAttended } = req.body;
    try {
        const check = await pool.query('SELECT * FROM csquare_members WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
        
        const current = check.rows[0];
        
        const result = await pool.query(
            `UPDATE csquare_members 
            SET name = $1, email = $2, phone = $3, track = $4, role = $5, batch = $6, github = $7, linkedin = $8, status = $9, eventsAttended = $10 
            WHERE id = $11 RETURNING *`,
            [
                name || current.name, 
                email || current.email, 
                phone !== undefined ? phone : current.phone, 
                track || current.track, 
                role || current.role, 
                batch !== undefined ? batch : current.batch, 
                github !== undefined ? github : current.github, 
                linkedin !== undefined ? linkedin : current.linkedin, 
                status || current.status, 
                eventsAttended !== undefined ? eventsAttended : current.eventsattended,
                id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete member (Admin only)
app.delete('/api/members/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM csquare_members WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
        res.json({ message: 'Member deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// FULL DASHBOARD INTEGRATION APIS
// ==========================================

// Dashboard Stats Endpoint
app.get('/api/dashboard/stats', isAdmin, async (req, res) => {
    try {
        const mCount = await pool.query('SELECT COUNT(*) FROM csquare_members');
        const eCount = await pool.query("SELECT COUNT(*) FROM csquare_events WHERE status = 'Upcoming'");
        const pCount = await pool.query("SELECT COUNT(*) FROM csquare_projects WHERE status = 'In Progress'");
        const newLeads = await pool.query("SELECT * FROM csquare_members ORDER BY id DESC LIMIT 5");
        const recentProj = await pool.query("SELECT * FROM csquare_projects ORDER BY id DESC LIMIT 5");

        const activeMembers = await pool.query("SELECT COUNT(*) FROM csquare_members WHERE status = 'Active'");
        const pendingMembers = await pool.query("SELECT COUNT(*) FROM csquare_members WHERE status = 'Pending'");

        const memberDates = await pool.query("SELECT created_at FROM csquare_members");
        
        const monthly = Array(12).fill(0);
        const weekly = Array(7).fill(0);
        const now = new Date();
        
        memberDates.rows.forEach(r => {
            const d = new Date(r.created_at || Date.now());
            // Monthly distribution for current year
            if (d.getFullYear() === now.getFullYear()) {
                monthly[d.getMonth()]++;
            }
            // Weekly distribution for last 7 days
            const diffTime = Math.abs(now - d);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays <= 7) {
                const dayIdx = (d.getDay() + 6) % 7; // Mon=0, Sun=6
                weekly[dayIdx]++;
            }
        });

        res.json({
            stats: {
                totalMembers: parseInt(mCount.rows[0].count),
                upcomingEvents: parseInt(eCount.rows[0].count),
                activeProjects: parseInt(pCount.rows[0].count)
            },
            charts: {
                memberStatus: {
                    active: parseInt(activeMembers.rows[0].count),
                    pending: parseInt(pendingMembers.rows[0].count)
                },
                growth: {
                    monthly,
                    weekly
                }
            },
            recentLeads: newLeads.rows,
            recentProjects: recentProj.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- PROJECTS API ---
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_projects ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/api/projects', isAdmin, async (req, res) => {
    const { name, leader, theme, status, deadline, repo, progress } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO csquare_projects (name, leader, theme, status, deadline, repo, progress) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, leader, theme, status || 'Pending', deadline || null, repo, progress || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.put('/api/projects/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, leader, theme, status, deadline, repo, progress } = req.body;
    try {
        const check = await pool.query('SELECT * FROM csquare_projects WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const c = check.rows[0];
        const result = await pool.query(
            'UPDATE csquare_projects SET name=$1, leader=$2, theme=$3, status=$4, deadline=$5, repo=$6, progress=$7 WHERE id=$8 RETURNING *',
            [name || c.name, leader || c.leader, theme || c.theme, status || c.status, deadline !== undefined ? deadline : c.deadline, repo || c.repo, progress !== undefined ? progress : c.progress, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.delete('/api/projects/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM csquare_projects WHERE id=$1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- TEAM API ---
app.get('/api/team', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_team ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/api/team', isAdmin, async (req, res) => {
    const { name, role, email, phone, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO csquare_team (name, role, email, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, role, email, phone, status || 'Active']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.put('/api/team/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, role, email, phone, status } = req.body;
    try {
        const check = await pool.query('SELECT * FROM csquare_team WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const c = check.rows[0];
        const result = await pool.query(
            'UPDATE csquare_team SET name=$1, role=$2, email=$3, phone=$4, status=$5 WHERE id=$6 RETURNING *',
            [name || c.name, role || c.role, email || c.email, phone || c.phone, status || c.status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.delete('/api/team/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM csquare_team WHERE id=$1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- TASKS API ---
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM csquare_tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/api/tasks', isAdmin, async (req, res) => {
    const { title, assignee, priority, status, due } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO csquare_tasks (title, assignee, priority, status, due) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, assignee, priority || 'Medium', status || 'Todo', due || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.put('/api/tasks/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, assignee, priority, status, due } = req.body;
    try {
        const check = await pool.query('SELECT * FROM csquare_tasks WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const c = check.rows[0];
        const result = await pool.query(
            'UPDATE csquare_tasks SET title=$1, assignee=$2, priority=$3, status=$4, due=$5 WHERE id=$6 RETURNING *',
            [title || c.title, assignee || c.assignee, priority || c.priority, status || c.status, due !== undefined ? due : c.due, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.delete('/api/tasks/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM csquare_tasks WHERE id=$1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Generic CMS Model generator for Highlights, Resources, Stories, Blog
const setupCMSAPI = (route, table) => {
    app.get(route, async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
            res.json(result.rows);
        } catch (err) { res.status(500).json({ error: 'Server error' }); }
    });
    
    app.post(route, isAdmin, async (req, res) => {
        try {
            const keys = Object.keys(req.body).filter(k => k !== 'id');
            const values = keys.map(k => req.body[k]);
            const placeholders = keys.map((_, i) => `$${i+1}`).join(', ');
            // Need quotes around 'desc' if it's used
            const safeKeys = keys.map(k => k === 'desc' ? '"desc"' : k).join(', ');
            
            const result = await pool.query(
                `INSERT INTO ${table} (${safeKeys}) VALUES (${placeholders}) RETURNING *`,
                values
            );
            res.status(201).json(result.rows[0]);
        } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
    });
    
    app.put(`${route}/:id`, isAdmin, async (req, res) => {
        try {
            const keys = Object.keys(req.body).filter(k => k !== 'id');
            if (keys.length === 0) return res.json({});
            const values = keys.map(k => req.body[k]);
            const setString = keys.map((k, i) => `${k === 'desc' ? '"desc"' : k}=$${i+1}`).join(', ');
            values.push(req.params.id);
            
            const result = await pool.query(
                `UPDATE ${table} SET ${setString} WHERE id=$${values.length} RETURNING *`,
                values
            );
            res.json(result.rows[0]);
        } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
    });
    
    app.delete(`${route}/:id`, isAdmin, async (req, res) => {
        try {
            await pool.query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
            res.json({ message: 'Deleted' });
        } catch (err) { res.status(500).json({ error: 'Server error' }); }
    });
};

setupCMSAPI('/api/cms/highlights', 'csquare_cms_highlights');
setupCMSAPI('/api/cms/resources', 'csquare_cms_resources');
setupCMSAPI('/api/cms/stories', 'csquare_cms_stories');
setupCMSAPI('/api/cms/blog', 'csquare_cms_blog');


// ==========================================
// SCHEDULED JOB: Auto-update event statuses
// ==========================================
// Runs every minute. Updates status based on event date:
//   • Same calendar day  → Ongoing
//   • Future date        → Upcoming
//   • Past date          → Completed
// NOTE: Events manually set to 'Completed' by admin whose date
//       has already passed will remain Completed regardless.
cron.schedule('* * * * *', async () => {
    try {
        // Cast the varchar date to ::date for comparison.
        // PostgreSQL handles ISO strings like '2026-03-20T14:00' correctly.
        const result = await pool.query(`
            UPDATE csquare_events
            SET status = CASE
                WHEN date::date = CURRENT_DATE THEN 'Ongoing'
                WHEN date::date > CURRENT_DATE THEN 'Upcoming'
                ELSE 'Completed'
            END
            WHERE date IS NOT NULL
              AND date != ''
              AND (status != 'Completed' OR date::date > CURRENT_DATE)
        `);
        if (result.rowCount > 0) {
            console.log(`[Scheduler] Auto-updated ${result.rowCount} event status(es).`);
        }
    } catch (err) {
        console.error('[Scheduler] Error updating event statuses:', err.message);
    }
});

console.log('[Scheduler] Event status auto-update job started (runs every minute).');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
