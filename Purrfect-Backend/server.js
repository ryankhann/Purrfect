import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

/* ----------------------------
   CORS CONFIG (PRODUCTION SAFE)
----------------------------- */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://purrfectweb.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow REST tools like Postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

/* ----------------------------
   MIDDLEWARE
----------------------------- */

app.use(express.json());

/* ----------------------------
   ROUTES
----------------------------- */

app.use('/api/auth', authRoutes);

/* ----------------------------
   HEALTH CHECK (Render-friendly)
----------------------------- */

app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Purrfect Backend is running 🐱"
  });
});

/* ----------------------------
   ROOT ROUTE
----------------------------- */

app.get('/', (req, res) => {
  res.send('Purrfect Backend Running 🐱');
});

/* ----------------------------
   START SERVER
----------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});