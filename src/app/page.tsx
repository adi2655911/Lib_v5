'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Subject = {
  name: string;
  link: string;
};

// Slugify function for clean filenames and URLs
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace spaces/symbols with -
    .replace(/(^-|-$)/g, '');    // trim leading/trailing -
}

function extractId(link: string): string {
  const parts = link.split('/');
  return parts[parts.length - 2];
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/subjects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubjects(data);
        else console.error("Invalid subject list");
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleClick = async (subject: Subject) => {
    const id = extractId(subject.link);
    const slug = slugify(subject.name);

    try {
      await fetch(
        `/api/fetch?id=${id}&link=${encodeURIComponent(subject.link)}&name=${slug}`
      );
    } catch (err) {
      console.error(`Failed to fetch HTML for ${id}`, err);
    } finally {
      router.push(`/data/${slug}`);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">StatPearls Topics</h1>

      {loading ? (
        <p>Loading...</p>
      ) : subjects.length === 0 ? (
        <p className="text-gray-500">No subjects found.</p>
      ) : (
        <ul className="space-y-1 list-disc list-inside">
          {subjects.map((subject, index) => (
            <li key={index}>
              <button
                onClick={() => handleClick(subject)}
                className="text-left text-blue-600 hover:underline cursor-pointer"
              >
                {subject.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}