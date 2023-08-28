import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { userRegisterSchema } from '@/lib/schema';
import { generateSuggestedUsernames } from '@/helpers/user';

enum ErrorCode {
  UserAlreadyExists,
  UserNotExists,
  WrongPassword,
  InvalidEmailFormat,
}

const extractNameParts = (name, cap = false) => {
  const sanitizedNames = name
    .replace(/\d/g, '')
    .trim()
    .split(/[\s_]+/);

  return cap || sanitizedNames.length === 2
    ? sanitizedNames.map(part => part.charAt(0).toUpperCase() + part.slice(1)).filter(Boolean)
    : sanitizedNames;
};

const generatedUserInfo = async (email: string, { name, username, first_name, last_name }) => {
  username =
    username ||
    email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 20);

  let [suggested_username] = await generateSuggestedUsernames(username);

  const name_parts = extractNameParts(username);

  return {
    username: suggested_username,
    email,
    first_name: first_name || name_parts[0],
    last_name: last_name || name_parts[1] || '',
    name: name || name_parts.join(' '),
  };
};

export async function POST(request: Request, response: Response) {
  try {
    let {
      email,
      new_password: password,
      username: _username,
      name: _name,
      first_name: _first_name,
      last_name: _last_name,
      type,
    } = userRegisterSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: `User with this email already exists.`,
          helper: {
            message: `User with this email already exists.`,
            field: 'email',
            code: ErrorCode.UserAlreadyExists,
          },
          error: null,
        },
        { status: 400 }
      );
    }

    const defaultValues = {
      username: _username,
      name: _name,
      first_name: _first_name,
      last_name: _last_name,
    };

    const { username, name, first_name, last_name } = await generatedUserInfo(email, defaultValues);

    if (type === 'passwordless') {
      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          name,
          username,
          email,
        },
      });

      return NextResponse.json(
        {
          message: `Welcome ${first_name} (passwodless)`,
          result: user,
        },
        { status: 201 }
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: `Welcome ${first_name}`,
        result: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
  }
}
