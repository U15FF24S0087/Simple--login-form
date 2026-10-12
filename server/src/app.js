import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'An unexpected server error occurred.' });
});

export default app;
