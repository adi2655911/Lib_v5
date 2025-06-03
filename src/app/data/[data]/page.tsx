import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs/promises';
import LinkInterceptor from './link-interceptor'; // We’ll define this below

export default async function DataPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = await params;
  const filePath = path.join(process.cwd(), 'htmldb', `${data}.html`);

  try {
    const html = await fs.readFile(filePath, 'utf-8');

    return (
      <main className="prose prose-lg mx-auto px-6 py-10">
        <LinkInterceptor />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>
    );
  } catch {
    return notFound();
  }
}