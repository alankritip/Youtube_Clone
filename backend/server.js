import express from 'express';


const app = express();

// Start Server
const PORT = process.env.PORT || 5000;
connectDatabase(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
});