const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack)
  const isProd = process.env.NODE_ENV === 'production'
  res.status(err.status || 500).json({
    error: isProd ? 'Server Error' : err.message || 'Server Error'
  })
}
export default errorHandler 