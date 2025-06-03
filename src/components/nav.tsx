'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Image
              src="/assets/favicon.webp"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-semibold">StatPearls</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-sky-600 dark:text-sky-400">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sky-600 dark:text-sky-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-100 dark:bg-slate-800 px-4 py-3 space-y-2">
          <Link href="/" className="block text-sky-600 dark:text-sky-400 hover:underline">Home</Link>
          <Link href="/about" className="block text-sky-600 dark:text-sky-400 hover:underline">About</Link>
          <Link href="/contact" className="block text-sky-600 dark:text-sky-400 hover:underline">Contact</Link>
          <Link href="/privacy" className="block text-sky-600 dark:text-sky-400 hover:underline">Privacy</Link>
        </div>
      )}
    </nav>
  );
}