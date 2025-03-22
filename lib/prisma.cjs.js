/* eslint-disable @typescript-eslint/no-require-imports */
// lib/prisma.cjs.js
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

const prisma = globalForPrisma.prisma;

module.exports = { prisma };
