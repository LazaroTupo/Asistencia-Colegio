import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Permitir si no hay origin (como herramientas de test)
    if (!origin) return callback(null, true);
    
    // Lista de permitidos o patrones
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    
    // Agregar origin de producción si existe la variable
    if (process.env.FRONTEND_URL) {
      allowed.push(process.env.FRONTEND_URL);
    }
    
    if (allowed.includes(origin) || origin.endsWith('.loca.lt') || origin.endsWith('.devtunnels.ms')) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_asistencia_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));

import baseRouter from './routes';

// Routes base
app.use('/api', baseRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
