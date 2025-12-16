import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected',
      userCount,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
