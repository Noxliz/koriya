import { authMiddleware } from './authMiddleware.js';
console.log('Type:', typeof authMiddleware);
console.log('Function check:', authMiddleware.toString().substring(0, 100));
