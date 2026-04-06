import { PrismaClient } from '@prisma/client';

// 1. Log the poisoned variables so we can see what dotenvx is doing
console.log("Environment Engine Type before:", process.env.PRISMA_CLIENT_ENGINE_TYPE);

// 2. THE KILL SWITCH: Delete the variable from Node.js memory
delete process.env.PRISMA_CLIENT_ENGINE_TYPE;

// 3. Initialize Prisma safely
const prisma = new PrismaClient();

export default prisma;