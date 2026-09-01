import express from 'express';
import { apiRouter } from './routes';

export function createApiApp() {
  const app = express();

  // Parse JSON and urlencoded request bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Middleware: Normalize Vercel rewrites and query param __route
  app.use((req, res, next) => {
    // Handle CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Normalize URL from Vercel rewrite (?__route=path)
    const qIndex = req.url.indexOf('?');
    const queryStr = qIndex !== -1 ? req.url.substring(qIndex + 1) : '';
    const params = new URLSearchParams(queryStr);
    const routeParam = params.get('__route');

    if (routeParam !== null && routeParam !== undefined) {
      const cleanPath = routeParam.startsWith('/') ? routeParam : `/${routeParam}`;
      params.delete('__route');
      const restQuery = params.toString();
      req.url = restQuery ? `${cleanPath}?${restQuery}` : cleanPath;
    } else if (req.url.startsWith('/api/index')) {
      req.url = req.url.replace('/api/index', '') || '/';
    }
    next();
  });

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

  // Global fallback error handler to prevent Function Crashes
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[API ERROR]', err);
    res.status(500).json({
      error: err?.message || 'Lỗi xử lý máy chủ nội bộ',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

