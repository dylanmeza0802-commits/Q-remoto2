import express from 'express';
import { TurnService } from './turn.service.js';
import { broadcastCancellation } from '../../socket/socket.manager.js';

const router = express.Router();

router.patch('/:id/cancel', async (req, res) => {
  try {
    const turn = await TurnService.cancelTurn(req.params.id);
    broadcastCancellation(turn.queueId, turn.id);
    res.json(turn);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;