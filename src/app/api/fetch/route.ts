import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

export async function GET(req: NextRequest) {
const id = req.nextUrl.searchParams.get('id');
const link = req.nextUrl.searchParams.get('link');
const name = req.nextUrl.searchParams.get('name');

  if (!id || !link) {
    return NextResponse.json({ error: 'Missing id or link' }, { status: 400 });
  }

const htmlPath = path.join(process.cwd(), 'htmldb', `${name}.html`);
const bsonPath = path.join(process.cwd(), 'db', `${name}.bson`);

if (existsSync(htmlPath) || existsSync(bsonPath)) {
  return NextResponse.json({ status: 'skipped', message: `${name} already exists.` });
}

  try {
    const cmd = `node scripts/fetch-html.js "${link}" "${name}"`;
    execSync(cmd, { stdio: 'inherit' });
    return NextResponse.json({ status: 'success', id });
  } catch (err: any) {
    console.error(`❌ Error running fetch-html for ${id}:`, err.message);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}