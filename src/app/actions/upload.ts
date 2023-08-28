'use server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export async function uploadAsset(data: FormData) {
  const file: File | null = data.get('csv') as unknown as File;

  if (!file || !file.size) {
    return {
      status: false,
      message: 'Please select a CSV file to upload',
    };
  }
  if (file.type !== 'text/csv') {
    return {
      status: false,
      message: `Invalid file type (${file.type})`,
    };
  }

  const bytes = await file.arrayBuffer();
  const csvString = Buffer.from(bytes).toString('utf-8');
}
