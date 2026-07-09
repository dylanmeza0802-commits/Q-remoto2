import express from 'express';
import { TurnService } from './turn.service.js';
import { broadcastCancellation, broadcastQueueUpdate } from '../../socket/socket.manager.js';
import { QueueService } from '../queue/queue.service.js';

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

router.post('/:id/cede', async (req, res) => {
  try {
    const { swapWithId } = req.body;
    const result = await TurnService.cedeTurn(req.params.id, swapWithId);
    const updated = await QueueService.getQueueState(result.queueId);
    broadcastQueueUpdate(result.queueId, updated);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;