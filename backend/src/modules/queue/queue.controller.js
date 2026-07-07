import express from 'express';
import { QueueService } from './queue.service.js';
import {
  broadcastQueueUpdate,
  broadcastDelay,
  broadcastTurnCalled,
} from '../../socket/socket.manager.js';

const router = express.Router();

// Obtener todas las filas activas
router.get('/', async (req, res) => {
  try {
    const queues = await QueueService.getActiveQueues();
    res.json(queues);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener estado de una fila
router.get('/:id', async (req, res) => {
  try {
    const queue = await QueueService.getQueueState(req.params.id);
    res.json(queue);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Unirse a una fila
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await QueueService.joinQueue(req.params.id, userId);
    const updated = await QueueService.getQueueState(req.params.id);
    broadcastQueueUpdate(req.params.id, updated);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Llamar siguiente turno
router.post('/:id/call-next', async (req, res) => {
  try {
    const turn = await QueueService.callNextTurn(req.params.id);
    if (!turn) return res.status(404).json({ error: 'Sin turnos en espera' });
    const updated = await QueueService.getQueueState(req.params.id);
    broadcastTurnCalled(req.params.id, turn);
    broadcastQueueUpdate(req.params.id, updated);
    res.json(turn);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Anunciar retraso
router.patch('/:id/delay', async (req, res) => {
  try {
    const { reason } = req.body;
    const queue = await QueueService.setDelay(req.params.id, reason);
    broadcastDelay(req.params.id, reason);
    res.json(queue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Limpiar retraso
router.patch('/:id/delay/clear', async (req, res) => {
  try {
    const queue = await QueueService.clearDelay(req.params.id);
    broadcastQueueUpdate(req.params.id, queue);
    res.json(queue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;