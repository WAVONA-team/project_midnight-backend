import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const prisma = new PrismaClient({ datasourceUrl: connectionString });

await prisma.$connect();

export default prisma;
