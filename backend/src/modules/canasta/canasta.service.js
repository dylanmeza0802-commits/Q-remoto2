import { prisma } from '../../config/database.js';

export const CanastaService = {

  async configureEvent({ floors, lanes }) {
    if (floors < 1 || floors > 2) throw new Error('Máximo 2 pisos');
    if (lanes < 1 || lanes > 4)   throw new Error('Máximo 4 filas');

    // Desactivar todas las filas actuales
    await prisma.queue.updateMany({ data: { isActive: false } });

    const created = [];
    for (let floor = 1; floor <= floors; floor++) {
      for (let lane = 1; lane <= lanes; lane++) {
        const laneNumber = (floor - 1) * lanes + lane;
        const queue = await prisma.queue.upsert({
          where: { laneNumber },
          update: { isActive: true, floor, isDelayed: false, delayReason: null, eventType: 'CANASTA_NAVIDENA' },
          create: { name: `Fila ${laneNumber} — Piso ${floor}`, laneNumber, floor, eventType: 'CANASTA_NAVIDENA' },
        });
        created.push(queue);
      }
    }
    return created;
  },

  async getConfig() {
    return prisma.queue.findMany({
      where: { isActive: true, eventType: 'CANASTA_NAVIDENA' },
      orderBy: [{ floor: 'asc' }, { laneNumber: 'asc' }],
    });
  },
};