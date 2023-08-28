import { handleZodError } from '@/helpers';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

const depSchema = z.object({
  name: z
    .string({
      required_error: 'The department name field is required',
      invalid_type_error: `Invalid input type. The department name field must be a string`,
    })
    .trim()
    .nonempty('The department name field cannot be empty')
    .min(2, {
      message: `The department name must have a minimum length of 2 characters`,
    })
    .max(40, {
      message: `The department name must have a maximum length of 40 characters`,
    })
    .toUpperCase()
    .transform(value => value.replaceAll(' ', '_')),
  description: z
    .string({
      invalid_type_error: `Invalid input type. The department description field must be a string`,
    })
    .trim()
    .min(10, {
      message: `The department description must have a minimum length of 10 characters`,
    })
    .max(100, {
      message: `The department description must have a maximum length of 100 characters`,
    })
    .optional(),
});

export async function POST(req: NextRequest, res: NextRequest) {
  try {
    const { name } = depSchema.parse(await req.json());

    const findDepartment = await prisma.department.findUnique({
      where: {
        name,
      },
    });

    if (findDepartment) {
      return NextResponse.json(
        {
          message: `This department name already exists (${name})`,
          result: null,
        },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        message: `Department created (${name})`,
        result: department,
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
