/** Handles unknown route requests */
export const notFound = (req, res) => res.status(404).json({ message: 'Resource Not Found' });

/** Handles runtime & operational errors */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
};
