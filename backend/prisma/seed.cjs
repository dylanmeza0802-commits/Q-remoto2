const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creando filas...');
  await prisma.queue.deleteMany();
  await prisma.queue.create({ data: { name: 'Fila 1', laneNumber: 1, floor: 1, isActive: true, minsPerPerson: 3, eventType: 'COMEDOR' } });
  await prisma.queue.create({ data: { name: 'Fila 2', laneNumber: 2, floor: 1, isActive: true, minsPerPerson: 3, eventType: 'COMEDOR' } });
  await prisma.queue.create({ data: { name: 'Fila 3', laneNumber: 3, floor: 1, isActive: true, minsPerPerson: 3, eventType: 'COMEDOR' } });
  console.log('✅ Listo');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());