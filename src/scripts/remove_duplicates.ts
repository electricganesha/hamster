const { PrismaClient } = require('../generated/prisma');
const { HamsterSession, RotationLogEntry } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Fetch all sessions with their rotation logs
  const sessions = await prisma.hamsterSession.findMany({
    include: { rotationLog: true },
  });

  // Map: key = `${start}-${end}`, value = array of session IDs
  const sessionMap = new Map<string, number[]>();

  for (const session of sessions) {
    if (!session.rotationLog.length) continue;
    const timestamps = session.rotationLog.map((r: typeof RotationLogEntry) => r.timestamp);
    const start = Math.min(...timestamps);
    const end = Math.max(...timestamps);
    const key = `${start}-${end}`;
    if (!sessionMap.has(key)) sessionMap.set(key, []);
    sessionMap.get(key)!.push(session.id);
  }

  let totalDeleted = 0;
  for (const [key, ids] of sessionMap.entries()) {
    if (ids.length > 1) {
      // Keep the first, delete the rest
      const toDelete = ids.slice(1);
      for (const id of toDelete) {
        await prisma.hamsterSession.delete({ where: { id } });
        console.log(`Deleted duplicate session with id ${id} (key: ${key})`);
        totalDeleted++;
      }
    }
  }
  console.log(`Done. Deleted ${totalDeleted} duplicate sessions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
