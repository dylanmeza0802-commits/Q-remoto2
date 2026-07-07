import { prisma } from '../../config/database.js';

export const TurnService = {
  async cancelTurn(turnId) {
    const turn = await prisma.turn.update({
      where: { id: turnId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    return turn;
  },
};