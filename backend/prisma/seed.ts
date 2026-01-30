import { PrismaClient } from '@prisma/client';
import seedIndustries from './seeds/seedIndustries';
import seedTemplates from './seeds/seedTemplates';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting database seeding...\n');

    try {
        // Seed industries
        await seedIndustries();
        console.log('');

        // Seed templates
        await seedTemplates();
        console.log('');

        console.log('✅ Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
