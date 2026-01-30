import { PrismaClient, CompetitionLevel } from '@prisma/client';

const prisma = new PrismaClient();

const industries = [
    {
        name: 'Technology',
        slug: 'technology',
        description: 'Software development, AI, cloud computing, cybersecurity, and IT services',
        avgStartupCost: 50000,
        avgTimeToLaunch: 6,
        competitionLevel: 'very_high' as CompetitionLevel,
        trendingScore: 95,
        iconName: 'laptop',
    },
    {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Medical services, telemedicine, health tech, pharmaceuticals, and wellness',
        avgStartupCost: 150000,
        avgTimeToLaunch: 12,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 90,
        iconName: 'heart-pulse',
    },
    {
        name: 'E-commerce',
        slug: 'e-commerce',
        description: 'Online retail, dropshipping, marketplace platforms, and digital products',
        avgStartupCost: 30000,
        avgTimeToLaunch: 4,
        competitionLevel: 'very_high' as CompetitionLevel,
        trendingScore: 92,
        iconName: 'shopping-cart',
    },
    {
        name: 'Finance',
        slug: 'finance',
        description: 'Fintech, payment processing, investment platforms, and financial advisory',
        avgStartupCost: 100000,
        avgTimeToLaunch: 9,
        competitionLevel: 'very_high' as CompetitionLevel,
        trendingScore: 88,
        iconName: 'dollar-sign',
    },
    {
        name: 'Education',
        slug: 'education',
        description: 'E-learning, online courses, tutoring, educational technology, and training',
        avgStartupCost: 40000,
        avgTimeToLaunch: 6,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 85,
        iconName: 'graduation-cap',
    },
    {
        name: 'Food & Beverage',
        slug: 'food-beverage',
        description: 'Restaurants, food delivery, catering, specialty foods, and beverages',
        avgStartupCost: 120000,
        avgTimeToLaunch: 8,
        competitionLevel: 'very_high' as CompetitionLevel,
        trendingScore: 78,
        iconName: 'utensils',
    },
    {
        name: 'Retail',
        slug: 'retail',
        description: 'Brick-and-mortar stores, specialty retail, and consumer goods',
        avgStartupCost: 80000,
        avgTimeToLaunch: 6,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 72,
        iconName: 'store',
    },
    {
        name: 'Real Estate',
        slug: 'real-estate',
        description: 'Property management, real estate brokerage, PropTech, and development',
        avgStartupCost: 200000,
        avgTimeToLaunch: 12,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 80,
        iconName: 'building',
    },
    {
        name: 'Manufacturing',
        slug: 'manufacturing',
        description: 'Product manufacturing, 3D printing, custom fabrication, and production',
        avgStartupCost: 250000,
        avgTimeToLaunch: 15,
        competitionLevel: 'medium' as CompetitionLevel,
        trendingScore: 70,
        iconName: 'factory',
    },
    {
        name: 'Energy',
        slug: 'energy',
        description: 'Renewable energy, solar, wind, energy efficiency, and sustainability',
        avgStartupCost: 300000,
        avgTimeToLaunch: 18,
        competitionLevel: 'medium' as CompetitionLevel,
        trendingScore: 87,
        iconName: 'zap',
    },
    {
        name: 'Transportation',
        slug: 'transportation',
        description: 'Logistics, delivery services, ride-sharing, and transportation tech',
        avgStartupCost: 150000,
        avgTimeToLaunch: 10,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 75,
        iconName: 'truck',
    },
    {
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Media, gaming, content creation, events, and entertainment platforms',
        avgStartupCost: 80000,
        avgTimeToLaunch: 8,
        competitionLevel: 'very_high' as CompetitionLevel,
        trendingScore: 83,
        iconName: 'film',
    },
    {
        name: 'Aerospace',
        slug: 'aerospace',
        description: 'Aviation, space technology, drones, and aerospace engineering',
        avgStartupCost: 500000,
        avgTimeToLaunch: 24,
        competitionLevel: 'low' as CompetitionLevel,
        trendingScore: 82,
        iconName: 'plane',
    },
    {
        name: 'Agriculture',
        slug: 'agriculture',
        description: 'Farming, AgriTech, sustainable agriculture, and food production',
        avgStartupCost: 180000,
        avgTimeToLaunch: 12,
        competitionLevel: 'medium' as CompetitionLevel,
        trendingScore: 76,
        iconName: 'sprout',
    },
    {
        name: 'Construction',
        slug: 'construction',
        description: 'Building, renovation, construction tech, and infrastructure',
        avgStartupCost: 220000,
        avgTimeToLaunch: 14,
        competitionLevel: 'medium' as CompetitionLevel,
        trendingScore: 73,
        iconName: 'hard-hat',
    },
    {
        name: 'Hospitality',
        slug: 'hospitality',
        description: 'Hotels, resorts, travel services, and tourism',
        avgStartupCost: 250000,
        avgTimeToLaunch: 15,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 79,
        iconName: 'bed',
    },
    {
        name: 'Media',
        slug: 'media',
        description: 'Publishing, journalism, podcasting, and digital media',
        avgStartupCost: 60000,
        avgTimeToLaunch: 6,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 81,
        iconName: 'newspaper',
    },
    {
        name: 'Telecommunications',
        slug: 'telecommunications',
        description: 'Communication services, networking, and telecom infrastructure',
        avgStartupCost: 350000,
        avgTimeToLaunch: 18,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 77,
        iconName: 'signal',
    },
    {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Auto manufacturing, EV technology, auto repair, and mobility services',
        avgStartupCost: 400000,
        avgTimeToLaunch: 20,
        competitionLevel: 'high' as CompetitionLevel,
        trendingScore: 84,
        iconName: 'car',
    },
    {
        name: 'Pharmaceuticals',
        slug: 'pharmaceuticals',
        description: 'Drug development, biotech, medical research, and pharmaceuticals',
        avgStartupCost: 800000,
        avgTimeToLaunch: 36,
        competitionLevel: 'medium' as CompetitionLevel,
        trendingScore: 86,
        iconName: 'pills',
    },
];

async function seedIndustries() {
    console.log('🌱 Seeding industries...');

    for (const industry of industries) {
        await prisma.industry.upsert({
            where: { slug: industry.slug },
            update: industry,
            create: industry,
        });
    }

    console.log(`✅ Seeded ${industries.length} industries`);
}

export default seedIndustries;

// Run if executed directly
if (require.main === module) {
    seedIndustries()
        .catch((e) => {
            console.error('❌ Error seeding industries:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
