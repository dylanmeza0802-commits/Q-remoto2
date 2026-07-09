import { prisma } from '../../config/database.js';

export const TurnService = {

  async cancelTurn(turnId) {
    return prisma.turn.update({
      where: { id: turnId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  },

  async cedeTurn(myTurnId, swapWithId) {
    // Obtener ambos turnos
    const myTurn   = await prisma.turn.findUnique({ where: { id: myTurnId } });
    const nextTurn = await prisma.turn.findUnique({ where: { id: swapWithId } });

    if (!myTurn || !nextTurn) throw new Error('Turnos no encontrados');
    if (myTurn.queueId !== nextTurn.queueId) throw new Error('Turnos en filas distintas');

    // Intercambiar tiempos de creación para cambiar posición en la fila
    const myCreatedAt   = myTurn.createdAt;
    const nextCreatedAt = nextTurn.createdAt;

    await prisma.turn.update({
      where: { id: myTurnId },
      data: { createdAt: nextCreatedAt, cedido: true },
    });
    await prisma.turn.update({
      where: { id: swapWithId },
      data: { createdAt: myCreatedAt },
    });

    await prisma.queue.findUnique({ where: { id: myTurn.queueId } });
    return { ...myTurn, queueId: myTurn.queueId };
  },
};