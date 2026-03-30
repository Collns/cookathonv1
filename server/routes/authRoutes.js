/**
 * authRoutes.js
 * 
 * Authentication routes for Recipia.
 * Handles user registration and login, returning JWTs for all
 * subsequent authenticated requests.
 * 
 * Routes:
 *   POST /api/auth/register  — create a new user account
 *   POST /api/auth/login     — authenticate and receive a token
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ─── REGISTER ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * 
 * Creates a new user account and returns a signed JWT.
 * Password hashing is handled automatically by the beforeCreate
 * hook defined in models/User.js — do not hash manually here.
 * 
 * @body {string} username - Unique display name
 * @body {string} email    - Unique email address
 * @body {string} password - Plain text password (hashed by model hook)
 * 
 * @returns {201} { user: { id, username, email, role }, token }
 * @returns {400} Missing required fields
 * @returns {409} Email already registered
 * @returns {500} Unexpected server error
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate all required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    // Check for duplicate email before attempting to create
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create the user — bcrypt hook in models/User.js hashes the password
    const user = await User.create({ username, email, password });

    // Sign a 7-day JWT containing the user's id, username, email, and role.
    // Role is included so downstream middleware (isAdmin) can read it
    // from req.user without an extra DB lookup on every request.
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Never return the password field — return only safe user fields
    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error('[auth/register] Error:', err.message);
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * 
 * Validates credentials and returns a signed JWT.
 * Both "user not found" and "wrong password" return 401 with the same
 * generic message — this prevents email enumeration attacks where an
 * attacker could probe which emails are registered.
 * 
 * @body {string} email    - Registered email address
 * @body {string} password - Plain text password to verify against hash
 * 
 * @returns {200} { user: { id, username, email, role }, token }
 * @returns {401} Invalid credentials (user not found or wrong password)
 * @returns {403} Account suspended (banned === true)
 * @returns {500} Unexpected server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look up the user by email.
    // Return 401 (not 404) if not found — do not reveal whether the email exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify the password using the instance method defined in models/User.js.
    // validPassword() uses bcrypt.compare() internally
    const valid = await user.validPassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Block banned users from logging in
    if (user.banned) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    // Sign the same JWT payload as register so token structure is consistent
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Never return the password field — return only safe user fields
    return res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error('[auth/login] Error:', err.message);
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

export default router;