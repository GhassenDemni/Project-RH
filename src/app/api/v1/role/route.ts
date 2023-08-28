import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { getSession } from '@/lib/session';
import { roleSchema } from '@/lib/schema';
import { handleZodError } from '@/helpers';

// export async function isAdmin() {
//   const session = await getSession();
//   if (!session?.user?.role || session.user.role !== 'ADMIN') {
//     const error = new Error('Only admins can access this route');
//     error.statusCode = 401; // Unauthorized status code
//     throw error;
//   } else {
//     return session.user;
//   }
// }

export async function GET() {
  try {
    const roles = await prisma.role.findMany();

    return NextResponse.json(
      {
        message: `Roles`,
        result: roles,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: handleZodError(error),
          error: error,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!(session?.user?.role === 'ADMIN')) {
      return NextResponse.json(
        {
          message: `Only admins are allowed to create roles`,
          result: null,
        },
        { status: 400 }
      );
    }

    const { name, description } = roleSchema.parse(await req.json());

    const findRole = await prisma.role.findUnique({
      where: {
        name,
      },
    });

    if (findRole) {
      return NextResponse.json(
        {
          message: `This role name (${name}) already exists`,
          result: null,
        },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        created_by_id: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: `Role created ${role.name}`,
        result: role,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: handleZodError(error),
          error: error,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, res: NextRequest) {
  try {
    const { id, name, description } = roleSchema.parse(await req.json());

    if (!id) {
      return NextResponse.json(
        {
          message: `Role id required`,
        },
        { status: 400 }
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(
      {
        message: `Role updated new name is (${updatedRole.name})`,
        result: updatedRole,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: handleZodError(error),
          error: error,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
