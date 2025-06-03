import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const link = req.nextUrl.searchParams.get('link');
  const name = req.nextUrl.searchParams.get('name');

  if (!id || !link || !name) {
    return NextResponse.json({ error: 'Missing id, link, or name' }, { status: 400 });
  }

  const htmlPath = path.join(process.cwd(), 'htmldb', `${name}.html`);

  if (existsSync(htmlPath)) {
    return NextResponse.json({ status: 'skipped', message: `${name}.html already exists.` });
  }

  try {
    const cmd = `node scripts/fetch-html.js "${link}" "${name}"`;
    execSync(cmd, { stdio: 'inherit' });
    return NextResponse.json({ status: 'success', id });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Error running fetch-html for ${id}:`, err.message);
      return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
    }

    // Fallback for unknown errors (non-Error types)
    console.error(`❌ Unknown error running fetch-html for ${id}`);
    return NextResponse.json({ status: 'error', message: 'Unknown error' }, { status: 500 });
  }
}