/**
 * Populate sample anti-cheat data for the admin dashboard.
 * Run from packages/db:
 *   npm run prisma:generate
 *   node prisma/populate-anti-cheat.js
 *
 * Requires DATABASE_URL (use .env or dotenv-cli).
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

const SEED_SERVER_ID = 999;
const SEED_REASON_PREFIX = 'Seeded -';
const SEED_ALERT_PREFIX = 'Seeded alert -';

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

function bucketStartForHoursAgo(hours) {
  const date = hoursAgo(hours);
  date.setMinutes(0, 0, 0);
  return date;
}

function hashPayload(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

async function ensureUser({ username, displayName, email }) {
  const normalizedEmail = email.toLowerCase();
  const password = await bcrypt.hash('test1234', 10);

  return prisma.user.upsert({
    where: { username },
    update: {
      displayName,
      email,
      normalizedEmail,
      emailVerified: true
    },
    create: {
      username,
      displayName,
      email,
      normalizedEmail,
      password,
      emailVerified: true
    }
  });
}

async function ensureAdminUser() {
  const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (existing) {
    return existing;
  }

  const password = await bcrypt.hash('admin123', 10);
  return prisma.user.create({
    data: {
      username: 'admin',
      displayName: 'Admin',
      email: 'admin@openspell.com',
      normalizedEmail: 'admin@openspell.com',
      password,
      isAdmin: true,
      playerType: 1,
      emailVerified: true
    }
  });
}

async function cleanupSeededData() {
  await prisma.anomalyAlert.deleteMany({
    where: {
      description: { startsWith: SEED_ALERT_PREFIX }
    }
  });

  await prisma.invalidPacketEvent.deleteMany({
    where: {
      reason: { startsWith: SEED_REASON_PREFIX }
    }
  });

  await prisma.invalidPacketEventRollup.deleteMany({
    where: {
      reason: { startsWith: SEED_REASON_PREFIX }
    }
  });

  await prisma.itemDropEvent.deleteMany({
    where: { serverId: SEED_SERVER_ID }
  });

  await prisma.itemPickupEvent.deleteMany({
    where: { serverId: SEED_SERVER_ID }
  });

  await prisma.shopItemSaleEvent.deleteMany({
    where: { serverId: SEED_SERVER_ID }
  });
}

async function seedAlertsForUser(user, adminUser) {
  const alerts = [
    {
      severity: 'CRITICAL',
      category: 'PACKET_ABUSE',
      description: `${SEED_ALERT_PREFIX}Rapid malformed packets`,
      detectedAt: minutesAgo(40),
      source: 'REALTIME',
      evidence: {
        packetsPerMinute: 420,
        samplePacket: 'C2S_Move',
        samplePayload: { x: 9999, y: -9999 }
      }
    },
    {
      severity: 'HIGH',
      category: 'ITEM_DUPE',
      description: `${SEED_ALERT_PREFIX}Suspicious item duplication`,
      detectedAt: hoursAgo(3),
      source: 'ANALYZER',
      evidence: {
        itemId: 240,
        totalAdded: 480,
        expectedMax: 50
      }
    },
    {
      severity: 'MEDIUM',
      category: 'WEALTH_SPIKE',
      description: `${SEED_ALERT_PREFIX}Unusual gold spike`,
      detectedAt: hoursAgo(7),
      source: 'ANALYZER',
      evidence: {
        goldDelta: 250000,
        windowMinutes: 15
      }
    }
  ];

  for (const alert of alerts) {
    const created = await prisma.anomalyAlert.create({
      data: {
        userId: user.id,
        severity: alert.severity,
        category: alert.category,
        description: alert.description,
        evidence: alert.evidence,
        detectedAt: alert.detectedAt,
        source: alert.source,
        serverId: SEED_SERVER_ID
      }
    });

    if (alert.severity === 'MEDIUM') {
      await prisma.anomalyAlert.update({
        where: { id: created.id },
        data: {
          dismissed: true,
          dismissedBy: adminUser.id,
          dismissedAt: minutesAgo(5)
        }
      });

      await prisma.anomalyAlertAction.create({
        data: {
          alertId: created.id,
          actorUserId: adminUser.id,
          action: 'DISMISS',
          note: 'Seeded dismissal for dashboard testing.'
        }
      });
    }
  }
}

async function seedInvalidPackets(user) {
  const payloadSample = { opcode: 17, payload: [255, 0, 255, 0] };
  const payloadHash = hashPayload(payloadSample);

  await prisma.invalidPacketEvent.create({
    data: {
      userId: user.id,
      serverId: SEED_SERVER_ID,
      actionType: 17,
      packetName: 'C2S_Move',
      reason: `${SEED_REASON_PREFIX}Malformed payload`,
      payloadHash,
      payloadSample,
      details: { note: 'Injected for anti-cheat UI testing.' },
      occurredAt: minutesAgo(25),
      count: 12
    }
  });

  const rollupBuckets = [1, 2, 4, 6, 12, 18].map(hours => ({
    bucketStart: bucketStartForHoursAgo(hours),
    count: Math.floor(Math.random() * 25) + 5
  }));

  for (const bucket of rollupBuckets) {
    await prisma.invalidPacketEventRollup.upsert({
      where: {
        userId_serverId_actionType_packetName_reason_bucketStart: {
          userId: user.id,
          serverId: SEED_SERVER_ID,
          actionType: 17,
          packetName: 'C2S_Move',
          reason: `${SEED_REASON_PREFIX}Malformed payload`,
          bucketStart: bucket.bucketStart
        }
      },
      update: { count: bucket.count },
      create: {
        userId: user.id,
        serverId: SEED_SERVER_ID,
        actionType: 17,
        packetName: 'C2S_Move',
        reason: `${SEED_REASON_PREFIX}Malformed payload`,
        bucketStart: bucket.bucketStart,
        count: bucket.count
      }
    });
  }
}

async function seedItemFlow(user, secondaryUser) {
  await prisma.itemDropEvent.create({
    data: {
      dropperUserId: user.id,
      itemId: 240,
      amount: BigInt(20),
      isIOU: 0,
      mapLevel: 1,
      x: 120,
      y: -45,
      serverId: SEED_SERVER_ID,
      droppedAt: minutesAgo(50)
    }
  });

  await prisma.itemPickupEvent.create({
    data: {
      pickerUserId: user.id,
      dropperUserId: secondaryUser.id,
      itemId: 240,
      amount: BigInt(10),
      isIOU: 0,
      mapLevel: 1,
      x: 120,
      y: -45,
      serverId: SEED_SERVER_ID,
      pickedUpAt: minutesAgo(35)
    }
  });

  await prisma.shopItemSaleEvent.create({
    data: {
      sellerUserId: user.id,
      buyerUserId: secondaryUser.id,
      shopId: 7,
      itemId: 58,
      amount: 3,
      priceEach: 1250,
      totalPrice: 3750,
      serverId: SEED_SERVER_ID,
      soldAt: minutesAgo(20)
    }
  });
}

async function main() {
  console.log('Populating anti-cheat seed data...');

  const adminUser = await ensureAdminUser();
  const users = await Promise.all([
    ensureUser({ username: 'cheater_one', displayName: 'Cheater One', email: 'cheater1@openspell.dev' }),
    ensureUser({ username: 'cheater_two', displayName: 'Cheater Two', email: 'cheater2@openspell.dev' }),
    ensureUser({ username: 'suspect_three', displayName: 'Suspect Three', email: 'suspect3@openspell.dev' })
  ]);

  await cleanupSeededData();

  for (const user of users) {
    await seedAlertsForUser(user, adminUser);
    await seedInvalidPackets(user);
  }

  await seedItemFlow(users[0], users[1]);
  await seedItemFlow(users[2], adminUser);

  console.log('Anti-cheat seed data created.');
  console.log('Seeded users: cheater_one, cheater_two, suspect_three');
  console.log('Admin user: admin (if missing, created with password admin123)');
}

main()
  .catch((error) => {
    console.error('Anti-cheat seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
