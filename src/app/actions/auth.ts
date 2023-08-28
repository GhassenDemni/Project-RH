'use server';
import prisma from '@/lib/prisma';
import { AuthOptionType, AuthOption } from '@prisma/client';

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
