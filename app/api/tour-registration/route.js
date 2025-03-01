import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const registrations = await prisma.tourRegistration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, persons, date } = body;

    if (!name || !phone || !address || !persons || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const registration = await prisma.tourRegistration.create({
      data: {
        name,
        phone,
        address,
        persons: parseInt(persons),
        date: new Date(date),
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
} 