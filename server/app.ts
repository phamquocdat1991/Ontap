import express from 'express';
import { apiRouter } from './routes';

export function createApiApp() {
  const app = express();

  // Parse JSON and urlencoded request bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'AI Learning Hub API',
      timestamp: new Date().toISOString() 
    });
  });

  // Mount API router on both root and /api for compatibility with direct calls & Vercel rewrites
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  return app;
}
