import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { deserialize } from 'bson';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'subjects.bson');
    const fileBuffer = await fs.readFile(filePath);
    const { subjects } = deserialize(fileBuffer); // ✅ use direct function

    if (Array.isArray(subjects)) {
      return NextResponse.json(subjects);
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (err: any) {
    console.error('Failed to read subjects.bson:', err.message);
    return NextResponse.json([], { status: 200 });
  }
}