import express from 'express';
import premios from '../controllers/premios';

const router = express.Router();

// Consultar premios
router.get('/premios', premios.getPremios);

// Añadir datos
router.post('/api/send-data', premios.addData);
export default router;