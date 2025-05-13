// src/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // Ici, tu peux définir 'any' ou un type plus spécifique pour l'utilisateur
    }
  }
}
