import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { generatedUserInfo } from '@/helpers/user';
import bcrypt from 'bcrypt';
import { z } from 'zod';

async function getPrismaModels() {
  const excludedProperties = [
    '_middlewares',
    '_createPrismaPromise',
    '$extends',
    '_extensions',
    '_previewFeatures',
    '_clientVersion',
    '_activeProvider',
    '_dataProxy',
    '_tracingHelper',
    '_clientEngineType',
    '_errorFormat',
    '_runtimeDataModel',
    '_engineConfig',
    '_engine',
    '_fetcher',
    '_metrics',
    '_appliedParent',
    '$parent',
  ];

  const allModels = Object.keys(prisma).filter(modelName => {
    return modelName !== 'PrismaClient' && !excludedProperties.includes(modelName);
  });

  return allModels;
}

const backup = async () => {
  const models = await getPrismaModels();
  const backupData = {};

  for (const modelName of models) {
    if (modelName !== 'PrismaClient') {
      const data = await prisma[modelName].findMany(); // Retrieve data for each model
      backupData[modelName] = data;
    }
  }

  const serializedData = JSON.stringify(backupData, null, 2);

  const backupDir = path.join(
    process.cwd(),
    'backups',
    'v1',
    new Date().toISOString().split('T')[0]
  );
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFilePath = path.join(backupDir, `backup.json`);

  fs.writeFileSync(backupFilePath, serializedData);

  return backupData;
};

export async function POST(req, res) {
  try {
    const cred = z.object({
      type: z.enum(['backup', 'restore']),
      email: z.string().email().optional(),
      password: z.string().min(1).optional(),
    });
    const { type, email, password } = cred.parse(await req.json());

    if (type === 'backup') {
      const serializedData = await backup();
      return NextResponse.json({
        message: 'Backup completed successfully',
        result: serializedData,
      });
    }
    if (type === 'restore' && email && password) {
      const serializedData = await backup();
      const models = await getPrismaModels();

      for (const modelName of models) {
        if (modelName !== 'PrismaClient') {
          await prisma[modelName].deleteMany();
        }
      }
      const userPayload = await generatedUserInfo(email);
      const hashedPassword = await bcrypt.hash(password, 12);

      const direction = await prisma.direction.create({
        data: {
          name: 'Direction 1',
          description: 'This is Organizational Strategy direction',
        },
      });

      const direction2 = await prisma.direction.create({
        data: {
          name: 'Direction 2',
          description: 'This is Organizational Strategy direction',
        },
      });

      const department = await prisma.department.create({
        data: {
          name: 'IT',
          description: 'IT',
          direction_id: direction.id,
        },
      });

      const department2 = await prisma.department.create({
        data: {
          name: 'Finance',
          direction_id: direction2.id,
        },
      });

      await prisma.position.createMany({
        data: [
          {
            name: 'Senior Software Engineer',
            description: 'Senior Software Engineer',
            department_id: department.id,
          },
          {
            name: 'Data Scientist',
            description: 'Data Scientist',
            department_id: department.id,
          },
          {
            name: 'Product Designer',
            description: 'Product Designere',
            department_id: department2.id,
          },
          {
            name: 'Customer Service Representative',
            description: 'Customer Service Representative',
            department_id: department2.id,
          },
        ],
      });

      const user = await prisma.user.create({
        data: {
          ...userPayload,
          department_id: department.id,
          direction_id: direction.id,
          password: hashedPassword,
        },
      });

      await prisma.role.createMany({
        data: [
          {
            name: 'ADMIN',
            description: 'This is ADMIN role',
            created_by_id: user.id,
          },
          {
            name: 'USER',
            description: 'This is USER role',
            created_by_id: user.id,
          },
          {
            name: 'MODERATOR',
            description: 'This is MODERATOR role',
            created_by_id: user.id,
          },
        ],
      });

      const roleAdmin = await prisma.role.findUnique({
        where: {
          name: 'ADMIN',
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role_id: roleAdmin?.id,
        },
        include: {
          Role: true,
        },
      });

      return NextResponse.json(
        {
          message: `Database restored`,
          result: serializedData,
        },
        { status: 201 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Something wrong',
        error: err,
      },
      { status: 500 }
    );
  }
}
