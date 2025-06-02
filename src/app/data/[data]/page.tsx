import { notFound } from 'next/navigation';

export default async function TopicPage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params; // ✅ Await this
  const res = await fetch(`http://localhost:3000/api/data/${data}`);
  if (!res.ok) return notFound();

  const topic = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <pre className="whitespace-pre-wrap text-gray-700">{topic.content}</pre>
    </main>
  );
}