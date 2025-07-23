export const validateRecipe = (req, res, next) => {
  let { title, ingredients, instructions } = req.body

  // Trim whitespace
  title = typeof title === 'string' ? title.trim() : title
  instructions = typeof instructions === 'string' ? instructions.trim() : instructions

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (title.length > 100 || instructions.length > 5000) {
    return res.status(400).json({ error: 'Too long input' })
  }

  const blacklist = /(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|;|--)/i
  if (blacklist.test(title) || blacklist.test(instructions) ||
      (typeof ingredients === 'string' && blacklist.test(ingredients))) {
    return res.status(400).json({ error: 'Invalid characters in input' })
  }

  next()
}