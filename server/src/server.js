import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env')
});

const port = Number(process.env.PORT) || 5000;
const requiredEnvironmentVariables = ['MONGODB_URI', 'JWT_SECRET'];
const missingVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]
);

if (missingVariables.length > 0) {
  console.error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
} catch (error) {
  console.error('Unable to start the server:', error);
  process.exit(1);
}
