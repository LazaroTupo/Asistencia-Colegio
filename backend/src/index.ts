import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import './types/express-session.d';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Puerto por defecto de Vite
  credentials: true // Importante para usar express-session con CORS
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_asistencia_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
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
