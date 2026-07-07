import express from 'express';
import { CanastaService } from './canasta.service.js';

const router = express.Router();

router.post('/configure', async (req, res) => {
  try {
    const { floors, lanes } = req.body;
    const queues = await CanastaService.configureEvent({ floors, lanes });
    res.json(queues);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/config', async (req, res) => {
  try {
    const config = await CanastaService.getConfig();
    res.json(config);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;