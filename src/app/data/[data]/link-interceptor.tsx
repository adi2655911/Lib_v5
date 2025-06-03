'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LinkInterceptor() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        const href = link.getAttribute('href');

        if (href && href.startsWith('/data/')) {
          e.preventDefault();
          router.push(href);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  return null;
}