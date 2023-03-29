import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: undefined | PrismaClient;
}
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;