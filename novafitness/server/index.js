import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import db from './db.js';
import {
  cleanText,
  isValidDate,
  isValidEmail,
  isValidMonth,
  normalizeEmail,
  toPositiveFloat,
  toPositiveInt,
} from './validation.js';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '4000', 10);
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

const requireAuth = (req, res, next) => {
  if (!req.session.userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
};

const getMonthBounds = (month) => {
  const [yearRaw, monthRaw] = month.split('-');
  const year = Number.parseInt(yearRaw, 10);
  const monthIndex = Number.parseInt(monthRaw, 10) - 1;

  const startDate = new Date(Date.UTC(year, monthIndex, 1));
  const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));

  return {
    start: startDate.toISOString().slice(0, 10),
    end: endDate.toISOString().slice(0, 10),
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  const email = normalizeEmail(String(req.body.email ?? ''));
  const password = String(req.body.password ?? '');

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }
  if (password.length === 0) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const existingUser = db.prepare('SELECT email FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, passwordHash);
    req.session.userEmail = email;
    return res.status(201).json({ user: { email } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(String(req.body.email ?? ''));
  const password = String(req.body.password ?? '');

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }
  if (password.length === 0) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const user = db.prepare('SELECT email, password_hash FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userEmail = user.email;
  return res.json({ user: { email: user.email } });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user: { email: req.session.userEmail } });
});

app.get('/api/workout-plans', requireAuth, (req, res) => {
  const month = String(req.query.month ?? '');
  const userEmail = req.session.userEmail;

  if (month && !isValidMonth(month)) {
    return res.status(400).json({ error: 'Invalid month format.' });
  }

  let rows;
  if (month) {
    const { start, end } = getMonthBounds(month);
    rows = db
      .prepare(
        `SELECT id, plan_date AS planDate, exercise_slug AS exerciseSlug, exercise_name AS exerciseName,
         sets, reps, notes
         FROM workout_plans
         WHERE user_email = ? AND plan_date >= ? AND plan_date < ?
         ORDER BY plan_date, id`,
      )
      .all(userEmail, start, end);
  } else {
    rows = db
      .prepare(
        `SELECT id, plan_date AS planDate, exercise_slug AS exerciseSlug, exercise_name AS exerciseName,
         sets, reps, notes
         FROM workout_plans
         WHERE user_email = ?
         ORDER BY plan_date, id`,
      )
      .all(userEmail);
  }

  return res.json({ plans: rows });
});

app.post('/api/workout-plans', requireAuth, (req, res) => {
  const userEmail = req.session.userEmail;
  const planDate = String(req.body.planDate ?? '');
  const exerciseSlug = cleanText(req.body.exerciseSlug, 80);
  const exerciseName = cleanText(req.body.exerciseName, 120);
  const sets = toPositiveInt(req.body.sets);
  const reps = toPositiveInt(req.body.reps);
  const notes = cleanText(req.body.notes, 500);

  if (!isValidDate(planDate)) {
    return res.status(400).json({ error: 'Invalid plan date.' });
  }
  if (!exerciseSlug || !exerciseName) {
    return res.status(400).json({ error: 'Exercise is required.' });
  }
  if (sets < 1 || sets > 20 || reps < 1 || reps > 200) {
    return res.status(400).json({ error: 'Sets/reps are out of range.' });
  }

  const result = db
    .prepare(
      `INSERT INTO workout_plans
      (user_email, plan_date, exercise_slug, exercise_name, sets, reps, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(userEmail, planDate, exerciseSlug, exerciseName, sets, reps, notes);

  return res.status(201).json({
    plan: {
      id: Number(result.lastInsertRowid),
      planDate,
      exerciseSlug,
      exerciseName,
      sets,
      reps,
      notes,
    },
  });
});

app.delete('/api/workout-plans/:id', requireAuth, (req, res) => {
  const userEmail = req.session.userEmail;
  const id = toPositiveInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'Invalid workout plan id.' });
  }

  const result = db.prepare('DELETE FROM workout_plans WHERE id = ? AND user_email = ?').run(id, userEmail);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Workout block not found.' });
  }

  return res.json({ ok: true });
});

app.get('/api/progress', requireAuth, (req, res) => {
  const userEmail = req.session.userEmail;
  const search = cleanText(req.query.search, 120).toLowerCase();

  let rows;
  if (search) {
    rows = db
      .prepare(
        `SELECT id, exercise_slug AS exerciseSlug, exercise_name AS exerciseName, weight, logged_at AS loggedAt, notes
         FROM progress_logs
         WHERE user_email = ? AND lower(exercise_name) LIKE ?
         ORDER BY logged_at DESC, id DESC`,
      )
      .all(userEmail, `%${search}%`);
  } else {
    rows = db
      .prepare(
        `SELECT id, exercise_slug AS exerciseSlug, exercise_name AS exerciseName, weight, logged_at AS loggedAt, notes
         FROM progress_logs
         WHERE user_email = ?
         ORDER BY logged_at DESC, id DESC`,
      )
      .all(userEmail);
  }

  return res.json({ logs: rows });
});

app.post('/api/progress', requireAuth, (req, res) => {
  const userEmail = req.session.userEmail;
  const exerciseSlug = cleanText(req.body.exerciseSlug, 80);
  const exerciseName = cleanText(req.body.exerciseName, 120);
  const weight = toPositiveFloat(req.body.weight);
  const loggedAt = String(req.body.loggedAt ?? '');
  const notes = cleanText(req.body.notes, 500);

  if (!exerciseSlug || !exerciseName) {
    return res.status(400).json({ error: 'Exercise is required.' });
  }
  if (!isValidDate(loggedAt)) {
    return res.status(400).json({ error: 'Invalid log date.' });
  }
  if (!weight || weight > 2000) {
    return res.status(400).json({ error: 'Weight is out of range.' });
  }

  const result = db
    .prepare(
      `INSERT INTO progress_logs
      (user_email, exercise_slug, exercise_name, weight, logged_at, notes)
      VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(userEmail, exerciseSlug, exerciseName, weight, loggedAt, notes);

  return res.status(201).json({
    log: {
      id: Number(result.lastInsertRowid),
      exerciseSlug,
      exerciseName,
      weight,
      loggedAt,
      notes,
    },
  });
});

app.delete('/api/progress/:id', requireAuth, (req, res) => {
  const userEmail = req.session.userEmail;
  const id = toPositiveInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'Invalid log id.' });
  }

  const result = db.prepare('DELETE FROM progress_logs WHERE id = ? AND user_email = ?').run(id, userEmail);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Log not found.' });
  }

  return res.json({ ok: true });
});

app.patch('/api/settings/email', requireAuth, async (req, res) => {
  const userEmail = req.session.userEmail;
  const newEmail = normalizeEmail(String(req.body.newEmail ?? ''));
  const password = String(req.body.password ?? '');

  if (!isValidEmail(newEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required to change email.' });
  }

  const currentUser = db.prepare('SELECT email, password_hash FROM users WHERE email = ?').get(userEmail);
  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isMatch = await bcrypt.compare(password, currentUser.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  const existing = db.prepare('SELECT email FROM users WHERE email = ?').get(newEmail);
  if (existing) {
    return res.status(409).json({ error: 'Email already in use.' });
  }

  const updateEmailTransaction = db.transaction(() => {
    db.prepare('UPDATE users SET email = ? WHERE email = ?').run(newEmail, userEmail);
  });
  updateEmailTransaction();

  req.session.userEmail = newEmail;
  return res.json({ user: { email: newEmail } });
});

app.patch('/api/settings/password', requireAuth, async (req, res) => {
  const userEmail = req.session.userEmail;
  const currentPassword = String(req.body.currentPassword ?? '');
  const newPassword = String(req.body.newPassword ?? '');

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' });
  }

  const currentUser = db.prepare('SELECT password_hash FROM users WHERE email = ?').get(userEmail);
  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid current password.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(passwordHash, userEmail);

  return res.json({ ok: true });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
