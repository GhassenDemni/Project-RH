import prisma from '@/lib/prisma';
import { AuthOptionType, AuthOption } from '@prisma/client';
import bcrypt from 'bcrypt';

const extractNameParts = (name: string, cap = false) => {
  const sanitizedNames = name
    .replace(/\d/g, '')
    .trim()
    .split(/[\s_]+/);

  return cap || sanitizedNames.length === 2
    ? sanitizedNames.map(part => part.charAt(0).toUpperCase() + part.slice(1)).filter(Boolean)
    : sanitizedNames;
};

export const generatedUserInfo = async (
  email: string,
  {
    name,
    username,
    first_name,
    last_name,
  }: {
    name?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  } = {}
) => {
  username =
    username ||
    email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 20);

  let [suggested_username] = await generateSuggestedUsernames(username);

  const name_parts = extractNameParts(username);

  return {
    email,
    username: suggested_username,
    first_name: first_name || name_parts[0],
    last_name: last_name || name_parts[1] || '',
    name: name || name_parts.join(' '),
  };
};

export const generateSuggestedUsernames = async (baseUsername: string, numberOfSuggestions = 1) => {
  let n = 1;
  let first_init = true;

  const suggestedUsernames = [];

  let existingUser = await prisma.user.findUnique({
    where: { username: baseUsername },
  });

  if (!existingUser) {
    return [baseUsername];
  }

  !first_init && suggestedUsernames.push(baseUsername);

  first_init = false;

  while (suggestedUsernames.length < numberOfSuggestions) {
    const suggestedUsername = `${baseUsername}${n}`;

    existingUser = await prisma.user.findUnique({
      where: { username: suggestedUsername },
    });

    if (!existingUser && !suggestedUsernames.includes(suggestedUsername)) {
      suggestedUsernames.push(suggestedUsername);
    }

    n++;
  }

  return suggestedUsernames;
};

export function generateStrongPassword(length = 12) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*_-+=<>?/';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  return password;
}

// "use server"

export const isAuthOptionAlreadyEnabled = (
  authOptions: AuthOption[],
  authOptionType: AuthOptionType
) => {
  return authOptions.some(option => option.type === authOptionType && option.isEnabled);
};

export const isAuthOptionExists = (authOptions: AuthOption[], authOptionType: AuthOptionType) => {
  return authOptions.some(option => option.type === authOptionType);
};

export async function getPreferredAuthMethod(payload: string | AuthOption[]) {
  let preferred_auth_option: AuthOption;
  if (Array.isArray(payload)) {
    preferred_auth_option = payload
      .filter(p => p.isEnabled && p.preferred)
      .sort((p1, p2) => new Date(p2.createdAt) - new Date(p2.createdAt))[0];
  }

  if (typeof payload === 'string') {
    preferred_auth_option = await prisma.authOption.findFirst({
      where: {
        user_id: payload,
        isEnabled: true,
        preferred: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });
  }

  if (!preferred_auth_option) {
    return null;
    // throw new Error("User does not has preferred auth method")
  }

  return preferred_auth_option;
}

export async function enableNewAuthOption(userId: string, newAuthOptionType: AuthOptionType) {
  // Get the current user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { auth_options: true },
  });

  if (!user) {
    throw new Error('No user in DB with this ID');
  }

  const existingAuthOptions = user.auth_options;

  // Check if the newAuthOptionType is already enabled
  if (isAuthOptionAlreadyEnabled(existingAuthOptions, newAuthOptionType)) {
    throw new Error(`${newAuthOptionType} is already enabled for this user.`);
  }

  // Update all existing auth_options to have preferred: false and isEnabled: false
  const updateExistingAuthOptions = await prisma.authOption.updateMany({
    where: { type: { not: newAuthOptionType } }, // Excluding the new auth option
    data: {
      preferred: false,
    },
  });

  // Create the new auth option with preferred: true and isEnabled: true
  const createNewAuthOption = await prisma.authOption.create({
    data: {
      type: newAuthOptionType,
      preferred: true,
      isEnabled: true,
      user: { connect: { id: userId } },
    },
  });

  return createNewAuthOption;
}

export const isPreferredAuth = async (userId: string, authOptionType: AuthOptionType) => {
  const per = await getPreferredAuthMethod(userId);
  if (!per) return false;
  return per.type === authOptionType;
};

export const setPreferredAuth = async (authOptionType: AuthOptionType) => {
  const updateExistingAuthOptions = await prisma.authOption.updateMany({
    where: { type: { not: authOptionType } }, // Excluding the new auth option
    data: {
      preferred: false,
    },
  });

  const updateAuthOption = await prisma.authOption.update({
    where: { type: authOptionType },
    data: {
      preferred: true,
      isEnabled: true,
    },
  });

  return updateAuthOption;
};

export async function deleteAuthOption(authOptionId: string) {
  // Check if the auth option to be deleted exists
  const existingAuthOption = await prisma.authOption.findUnique({
    where: { id: authOptionId },
  });

  if (!existingAuthOption) {
    throw new Error('The specified auth option does not exist.');
  }

  // Delete the auth option
  const deletedAuthOption = await prisma.authOption.delete({
    where: { id: authOptionId },
  });

  return deletedAuthOption;
}

export const updateUserPassword = async (user_id: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error('User with id not found');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.user.update({
    where: { id: user_id },
    data: {
      password: hashedPassword,
    },
  });
};
