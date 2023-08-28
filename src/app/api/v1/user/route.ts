import transporter from '@/lib/nodemailer';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from '@/lib/schema';
import { generatedUserInfo, generateStrongPassword } from '@/helpers/user';
import { handleZodError } from '@/helpers';
import { ZodError } from 'zod';

export async function POST(req: NextRequest, res: NextRequest) {
  try {
    const { name, email, phone, role_id, employee, ...rest } = userSchema.parse(await req.json());

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return NextResponse.json(
        {
          message: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    const userPayload = await generatedUserInfo(email, { name });
    const password = generateStrongPassword();
    const hashedPassword = await bcrypt.hash(password, 12);

    const employeeData = {
      Employee: {
        create: employee,
      },
      role_id,
      password: hashedPassword,
      ...userPayload,
      ...rest,
    };

    const user = await prisma.user.create({
      data: employeeData,
    });

    const mailOptions = {
      from: process.env.SMTP_FROM, // sender address
      to: user.email, // user's email address
      subject: 'Account Credentials', // Subject line
      text: `Hello,\n\nYour account has been created. Here are your credentials:\n\nEmail: ${user.email}\nPassword: ${password}\n\nPlease keep this information secure.\n\nBest regards,\nThe Admin Team`, // plain text body
      html: `<p>Hello,</p><p>Your account has been created. Here are your credentials:</p><ul><li><b>Email:</b> ${user.email}</li><li><b>Password:</b> ${password}</li></ul><p>Please keep this information secure.</p><p>Best regards,<br>The Cyfer Team</p>`, // html body
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    if (!emailResponse) {
      return NextResponse.json(
        {
          message: `Some thing wrong when sending email`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `User created (${user.name})`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('🚀 ~ file: route.ts:70 ~ POST ~ error:', error);
    if (error instanceof ZodError) {
      const message = handleZodError(error);
      return NextResponse.json(
        {
          message: message,
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
    const { id, email, phone, role_id, department_id, position, name } = userSchema.parse(
      await req.json()
    );

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        role_id,
        department_id,
        position,
        phone,
      },
    });

    return NextResponse.json(
      {
        message: `User updated (${updatedUser.name})`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = handleZodError(error);
      return NextResponse.json(
        {
          message: message,
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
