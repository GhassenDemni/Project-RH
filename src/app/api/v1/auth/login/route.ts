import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { userLoginSchema } from '@/lib/schema';
import { NextResponse } from 'next/server';
import limiter from '@/app/api/config/limiter';
import { ErrorCode, AuthMethod } from '@/types/enums';
import { getPreferredAuthMethod } from '@/helpers/user';
import speakeasy from 'speakeasy';

const checkTextType = text => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (emailRegex.test(text)) {
    return 'email';
  } else if (usernameRegex.test(text)) {
    return 'username';
  } else if (phoneRegex.test(text)) {
    return 'phone';
  } else {
    return 'unknown';
  }
};

export async function POST(request, response) {
  try {
    const { username, password, otp: otp_code, type } = userLoginSchema.parse(await request.json());

    const remaining = await limiter.removeTokens(1);

    if (remaining < 0) {
      return Response.json(
        {
          message: `Login error you have reached maximum retry, please try again later.`,
          error: {
            code: ErrorCode.ToManyRequests,
          },
        },
        { status: 429 }
      );
    }

    let cred = checkTextType(username);

    if (cred === 'unknown') {
      return Response.json(
        {
          message: `Invalid username.`,
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: username,
      },
      include: {
        auth_options: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: `Couldn't find an account with this ${cred}.`,
          error: {
            message: `UserNotExists`,
            code: ErrorCode.UserNotExists,
          },
          helper: {
            message: `Couldn't find an account with this ${cred}.`,
            field: 'username',
            code: ErrorCode.UserNotExists,
          },
        },
        { status: 401 }
      );
    }

    const preferred_method = await getPreferredAuthMethod(user.auth_options);

    // default log with password
    if (!user.password) {
      return Response.json(
        {
          message: `Please provide password`,
          error: {
            code: ErrorCode.NeedOtp,
          },
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          message: `Password need it.`,
          helper: {
            message: `Password need it.`,
            field: 'password',
            type: 'info',
            code: ErrorCode.PasswordNeedIt,
          },
          error: {
            code: ErrorCode.PasswordNeedIt,
          },
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: `Wrong password.`,
          helper: {
            message: `Wrong password.`,
            field: 'password',
            code: ErrorCode.WrongPassword,
          },
          error: {
            code: ErrorCode.WrongPassword,
          },
        },
        { status: 401 }
      );
    }

    // disbled in dev MODE for dev perp
    switch (preferred_method?.type) {
      case AuthMethod.TOTP:
        //tell client this user enabled TOTP so display OTP input
        if (!otp_code) {
          return NextResponse.json(
            {
              message: `User has otp enabled`,
              helper: {
                field: 'otp',
                code: ErrorCode.NeedOtp,
              },
              error: {
                field: 'otp',
                code: ErrorCode.NeedOtp,
              },
            },
            { status: 400 }
          );
        }

        const otpRecord = await prisma.otp.findFirst({
          where: { user_id: user.id },
          orderBy: { createdAt: 'desc' },
        });

        if (!otpRecord) {
          return NextResponse.json({ message: 'OTP record not found' }, { status: 400 });
        }

        // Verify the OTP code
        const isMatch = speakeasy.totp.verify({
          secret: otpRecord.secret,
          encoding: 'base32',
          token: otp_code,
        });

        if (!isMatch) {
          return NextResponse.json(
            {
              message: 'Invalid OTP code',
              error: {
                code: ErrorCode.InvalidOTP,
              },
              helper: {
                code: ErrorCode.InvalidOTP,
                field: 'otp',
              },
            },
            { status: 401 }
          );
        }
    }

    return NextResponse.json(
      {
        message: `Welcome back ${user.name || user.username || ''}`,
        result: user,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: error.message, error }, { status: 500 });
    }
  }
}
