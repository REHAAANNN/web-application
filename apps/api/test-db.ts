import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const count = await prisma.invoice.count();
    console.log('✅ Database connection successful!');
    console.log(`Found ${count} invoices in the database`);
    
    const stats = await prisma.summary.aggregate({
      _sum: { invoiceTotal: true },
      _avg: { invoiceTotal: true },
    });
    
    console.log('Total spend:', stats._sum.invoiceTotal);
    console.log('Average invoice value:', stats._avg.invoiceTotal);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
