/**
 * isAdmin middleware — S1-06
 * 
 * Checks that the authenticated user has role="admin"
 * Must run AFTER auth middleware (which sets req.user from JWT)
 * 
 * - 401 if req.user is missing (safety net — auth should catch this first)
 * - 403 if user exists but isn't an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden — admin only' })
  next()
}

export default isAdmin