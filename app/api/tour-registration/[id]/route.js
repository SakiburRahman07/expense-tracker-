import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const registration = await prisma.tourRegistration.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update registration status' },
      { status: 500 }
    );
  }
} 