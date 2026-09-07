import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { createApiRouter } from './server/routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureFaceService() {
  fetch('http://127.0.0.1:8001/health')
    .then((res) => {
      if (res.ok) console.log('[FaceProof] FastAPI Biometric Intelligence service is active on :8001');
      else throw new Error('Not ok');
    })
    .catch(() => {
      console.log('[FaceProof] Spawning Python FastAPI + InsightFace service on :8001...');
      const pythonCommand = process.platform === 'win32' ? 'py' : 'python3';
      const py = spawn(pythonCommand, [path.join(__dirname, 'server/face_service.py')], {
        stdio: 'inherit'
      });
      py.on('error', (err) => console.error('[FaceProof] Failed to spawn Python face service:', err));
    });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  ensureFaceService();

  // JSON payload parser with capacity for base64 image data
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Security and Cache-Control headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // Mount API router FIRST
  app.use('/api', createApiRouter());

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FaceProof] Forensic Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[FaceProof] Failed to start server:', err);
  process.exit(1);
});
