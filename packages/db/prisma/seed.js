/**
 * Seed script to populate initial data
 * Run with: npm run prisma:seed (from packages/db)
 * 
 * This script seeds:
 * - Skills (all game skills)
 * - News items (from news.json)
 * - Worlds (game servers)
 * - Admin user with complete player data (skills, location, equipment, inventory)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Helper function to compute the overall skill level/XP from all non-overall skills.
 * This mirrors the logic in api-server.js for consistency.
 */
async function recomputeOverallForUser(db, userId, overallSkillId, persistenceId) {
  const nonOverallSkills = await db.playerSkill.findMany({
    where: {
      userId,
      persistenceId,
      skillId: { not: overallSkillId }
    },
    select: {
      level: true,
      experience: true
    }
  });

  if (nonOverallSkills.length === 0) {
    // No non-overall skills yet; set overall to level 1, xp 0.
    await db.playerSkill.upsert({
      where: { userId_persistenceId_skillId: { userId, persistenceId, skillId: overallSkillId } },
      update: { level: 1, experience: BigInt(0) },
      create: { userId, persistenceId, skillId: overallSkillId, level: 1, experience: BigInt(0) }
    });
    return;
  }

  const totalLevel = nonOverallSkills.reduce((sum, ps) => sum + (ps.level ?? 1), 0);
  const totalXp = nonOverallSkills.reduce((sum, ps) => sum + (ps.experience ?? BigInt(0)), BigInt(0));

  await db.playerSkill.upsert({
    where: { userId_persistenceId_skillId: { userId, persistenceId, skillId: overallSkillId } },
    update: { level: totalLevel, experience: totalXp },
    create: { userId, persistenceId, skillId: overallSkillId, level: totalLevel, experience: totalXp }
  });
}

/**
 * Ensure a user has all initial player skills (one row per skill, starting at level 1).
 * This is idempotent - will not overwrite existing skill values.
 */
async function ensureInitialPlayerSkillsForUser(db, userId, persistenceId) {
  const skills = await db.skill.findMany({
    select: { id: true, slug: true },
    orderBy: { displayOrder: 'asc' }
  });

  const overall = skills.find(s => s.slug === 'overall');
  const nonOverall = skills.filter(s => s.slug !== 'overall');

  if (!overall || nonOverall.length === 0) {
    throw new Error('Skills are not seeded (missing overall and/or non-overall skills)');
  }

  // Create non-overall rows if missing, but do not overwrite if already present.
  for (const skill of nonOverall) {
    await db.playerSkill.upsert({
      where: { userId_persistenceId_skillId: { userId, persistenceId, skillId: skill.id } },
      update: {},
      create: {
        userId,
        persistenceId,
        skillId: skill.id,
        level: 1,
        experience: BigInt(0)
      }
    });
  }

  // Overall is derived from the other skills; compute it from current rows.
  await recomputeOverallForUser(db, userId, overall.id, persistenceId);
}

/**
 * Ensure a user has an initial location.
 * Default spawn: mapLevel 1 (overworld), x: 78, y: -93
 */
async function ensureInitialPlayerLocationForUser(db, userId, persistenceId) {
  await db.playerLocation.upsert({
    where: { userId_persistenceId: { userId, persistenceId } },
    update: {},
    create: {
      userId,
      persistenceId,
      mapLevel: 1,
      x: 78,
      y: -93
    }
  });
}

/**
 * Ensure a user has default (empty) equipment slots.
 * Pre-creates one row per slot with itemDefId/amount NULL.
 */
async function ensureInitialPlayerEquipmentForUser(db, userId, persistenceId) {
  const slots = [
    'helmet',
    'chest',
    'legs',
    'boots',
    'neck',
    'weapon',
    'shield',
    'back',
    'gloves',
    'projectile'
  ];

  for (const slot of slots) {
    await db.playerEquipment.upsert({
      where: { userId_persistenceId_slot: { userId, persistenceId, slot } },
      update: {},
      create: {
        userId,
        persistenceId,
        slot,
        itemDefId: null,
        amount: null
      }
    });
  }
}

/**
 * Ensure a user has starter inventory items.
 * Gives new players a basic set of starter items (4 items in slots 0-3).
 */
async function ensureInitialPlayerInventory(db, userId, persistenceId) {
  // Starter items: [slot, itemId, amount, isIOU]
  const starterItems = [
    [0, 240, 1, 0],  // Slot 0: Item ID 240, qty 1, regular item
    [1, 52, 1, 0],   // Slot 1: Item ID 52, qty 1, regular item
    [2, 58, 1, 0],   // Slot 2: Item ID 58, qty 1, regular item
    [3, 7, 1, 0]     // Slot 3: Item ID 7, qty 1, regular item
  ];

  for (const [slot, itemId, amount, isIOU] of starterItems) {
    await db.playerInventory.upsert({
      where: { userId_persistenceId_slot: { userId, persistenceId, slot } },
      update: {},  // Don't overwrite if item already exists in this slot
      create: {
        userId,
        persistenceId,
        slot,
        itemId,
        amount,
        isIOU
      }
    });
  }
}

/**
 * Ensure a user has default appearance values.
 */
async function ensureInitialPlayerAppearanceForUser(db, userId, persistenceId) {
  await db.playerAppearance.upsert({
    where: { userId_persistenceId: { userId, persistenceId } },
    update: {},
    create: {
      userId,
      persistenceId,
      hairStyleId: 1,
      beardStyleId: 1,
      shirtId: 1,
      bodyTypeId: 0,
      legsId: 5
    }
  });
}

async function resolveDefaultPersistenceId(db) {
  // Look for the first active world by sortOrder (serverId 100 is the Docker default)
  // This ensures the admin user gets the correct persistenceId regardless of which worlds exist
  const world = await db.world.findFirst({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { serverId: true, persistenceId: true }
  });
  if (!world || !Number.isInteger(world.persistenceId) || world.persistenceId <= 0) {
    throw new Error('No active world found for persistenceId seeding. Ensure at least one world is seeded.');
  }
  console.log(`Using world serverId=${world.serverId} (persistenceId=${world.persistenceId}) for admin user`);
  return world.persistenceId;
}

async function main() {
  console.log('Starting seed...');
  
  // Seed skills
  const skills = [
    { slug: 'overall', title: 'Overall', iconPosition: '-256px 0', displayOrder: 0 , clientReference: null},
    { slug: 'hitpoints', title: 'Hitpoints', iconPosition: '0 0', displayOrder: 1 , clientReference: 0},
    { slug: 'accuracy', title: 'Accuracy', iconPosition: '-16px 0', displayOrder: 2, clientReference: 1},
    { slug: 'strength', title: 'Strength', iconPosition: '-32px 0', displayOrder: 3, clientReference: 2},
    { slug: 'defense', title: 'Defense', iconPosition: '-48px 0', displayOrder: 4, clientReference: 3},
    { slug: 'magic', title: 'Magic', iconPosition: '-64px 0', displayOrder: 5, clientReference: 4},
    { slug: 'range', title: 'Range', iconPosition: '-240px 0', displayOrder: 6, clientReference: 5},
    { slug: 'fishing', title: 'Fishing', iconPosition: '-80px 0', displayOrder: 7, clientReference: 6},
    { slug: 'cooking', title: 'Cooking', iconPosition: '-96px 0', displayOrder: 8, clientReference: 7},
    { slug: 'forestry', title: 'Forestry', iconPosition: '-112px 0', displayOrder: 9, clientReference: 8},
    { slug: 'mining', title: 'Mining', iconPosition: '-128px 0', displayOrder: 10, clientReference: 9},
    { slug: 'smithing', title: 'Smithing', iconPosition: '-192px 0', displayOrder: 11, clientReference: 10},
    { slug: 'crafting', title: 'Crafting', iconPosition: '-144px 0', displayOrder: 12, clientReference: 11},
    { slug: 'harvesting', title: 'Harvesting', iconPosition: '-208px 0', displayOrder: 13, clientReference: 12},
    { slug: 'crime', title: 'Crime', iconPosition: '-160px 0', displayOrder: 14, clientReference: 13},
    { slug: 'potionmaking', title: 'Potionmaking', iconPosition: '-176px 0', displayOrder: 15, clientReference: 14},
    { slug: 'enchanting', title: 'Enchanting', iconPosition: '-224px 0', displayOrder: 16, clientReference: 15},
    { slug: 'athletics', title: 'Athletics', iconPosition: '-272px 0', displayOrder: 17, clientReference: 16}
  ];
  
  for (const skill of skills) {
    try {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: {
          title: skill.title,
          iconPosition: skill.iconPosition,
          displayOrder: skill.displayOrder
        },
        create: skill
      });
      console.log(`Seeded skill: ${skill.title}`);
    } catch (error) {
      console.error(`Error seeding skill ${skill.slug}:`, error.message);
    }
  }
  
  // Seed initial news from news.json if it exists
  const fs = require('fs');
  const path = require('path');
  // Updated path: from packages/db/prisma to apps/web/news.json
  const newsJsonPath = path.join(__dirname, '..', '..', '..', 'apps', 'web', 'news.json');
  
  if (fs.existsSync(newsJsonPath)) {
    const newsData = JSON.parse(fs.readFileSync(newsJsonPath, 'utf8'));
    
    for (const item of newsData.items) {
      try {
        await prisma.news.upsert({
          where: { slug: item.slug },
          update: {},
          create: {
            title: item.title,
            slug: item.slug,
            type: item.type || 'Game',
            date: new Date(item.date),
            description: item.description,
            picture: item.picture,
            thumbnail: item.thumbnail,
            content: item.content
          }
        });
        console.log(`Seeded news: ${item.title}`);
      } catch (error) {
        console.error(`Error seeding news ${item.slug}:`, error.message);
      }
    }
  }

  // Seed worlds (game servers) used by /play and /game
  // 
  // For Docker local setup: World 100 uses http://localhost:8888 which maps to the game container.
  // The game server's SERVER_ID env var must match the serverId here.
  // 
  // For production: Add your own worlds with proper domain URLs (e.g., https://game.yourdomain.com:8888)
  //
  const worlds = [
    // Default Docker world - this is what users click on when running Docker locally
    // Uses http:// because USE_HTTPS=false in docker.env by default
    {
      serverId: 100,
      name: 'World 1',
      locationName: 'Local',
      flagCode: 'USA',
      serverUrl: 'http://localhost:8888',
      tags: '',
      sortOrder: 1,
      isActive: true,
      isDevelopment: false
    }
  ];

  for (const world of worlds) {
    try {
      await prisma.world.upsert({
        where: { serverId: world.serverId },
        update: {
          name: world.name,
          locationName: world.locationName,
          flagCode: world.flagCode,
          serverUrl: world.serverUrl,
          tags: world.tags || '',
          sortOrder: world.sortOrder,
          isActive: world.isActive,
          isDevelopment: world.isDevelopment
        },
        create: world
      });
      console.log(`Seeded world: ${world.name} (serverId=${world.serverId})`);
    } catch (error) {
      console.error(`Error seeding world ${world.serverId}:`, error.message);
    }
  }
  const persistenceId = await resolveDefaultPersistenceId(prisma);
  
  // Create a test admin user (password: admin123) with complete player data
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        isAdmin: true, // Ensure admin user always has admin privileges
        playerType: 1  // PlayerType.Admin = 1
      },
      create: {
        username: 'admin',
        displayName: 'Admin',
        email: 'admin@openspell.com',
        normalizedEmail: 'admin@openspell.com', // Required for uniqueness checking
        password: hashedPassword,
        isAdmin: true, // Set as admin
        playerType: 1, // PlayerType.Admin = 1 (0=Default, 1=Admin, 2=Mod, 3=PlayerMod)
        emailVerified: true // Auto-verify admin email
      }
    });
    console.log('Seeded admin user (username: admin, password: admin123, isAdmin: true, playerType: Admin)');
    
    // Initialize all player data for the admin user
    console.log('Initializing player data for admin user...');
    await ensureInitialPlayerSkillsForUser(prisma, adminUser.id, persistenceId);
    console.log('  ✓ Skills initialized');
    
    await ensureInitialPlayerLocationForUser(prisma, adminUser.id, persistenceId);
    console.log('  ✓ Location initialized');
    
    await ensureInitialPlayerEquipmentForUser(prisma, adminUser.id, persistenceId);
    console.log('  ✓ Equipment initialized');
    
    await ensureInitialPlayerInventory(prisma, adminUser.id, persistenceId);
    console.log('  ✓ Inventory initialized');

    await ensureInitialPlayerAppearanceForUser(prisma, adminUser.id, persistenceId);
    console.log('  ✓ Appearance initialized');
    
    console.log('Admin user player data initialized successfully!');
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
  
  console.log('\n=================================');
  console.log('Seed completed successfully!');
  console.log('=================================');
  console.log('Admin credentials:');
  console.log('  Username: admin');
  console.log('  Password: admin123');
  console.log('=================================\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
