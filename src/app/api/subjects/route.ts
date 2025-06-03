import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { deserialize } from 'bson';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'subjects.bson');
    const fileBuffer = await fs.readFile(filePath);
    const { subjects } = deserialize(fileBuffer);

    if (Array.isArray(subjects)) {
      return NextResponse.json(subjects);
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Failed to read subjects.bson:', err.message);
    } else {
      console.error('Failed to read subjects.bson: Unknown error');
    }

    return NextResponse.json([], { status: 200 });
  }
}