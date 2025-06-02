import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs/promises';
import { deserialize } from 'bson';

export default async function DataPage({
  params
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = await params; // e.g., "Bell Palsy"
  const filePath = path.join(process.cwd(), 'db', `${data}.bson`);

  try {
    const buffer = await fs.readFile(filePath);
    const content = deserialize(buffer) as Record<string, string>;

    return (
      <main className="p-6 space-y-6">
        {Object.entries(content).map(([section, text]) => (
          <section key={section}>
            <h2 className="text-xl font-bold mb-2">{section}</h2>
            <p className="text-gray-700 whitespace-pre-line">{text}</p>
          </section>
        ))}
      </main>
    );
  } catch (err) {
    return notFound();
  }
}