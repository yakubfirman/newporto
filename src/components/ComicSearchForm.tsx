'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface ComicSearchFormProps {
  placeholder?: string;
  basePath: string;
}

export default function ComicSearchForm({
  placeholder = 'Cari...',
  basePath,
}: ComicSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    // reset page to 1 when searching
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm relative z-10 comic-shadow hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-[3px] border-black border-r-0 px-4 py-2 sm:py-3 bg-white text-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors comic-heading text-sm"
      />
      <button
        type="submit"
        className="bg-primary text-white border-[3px] border-black px-4 flex items-center justify-center hover:bg-black transition-colors"
        aria-label="Cari"
      >
        <Search size={20} strokeWidth={3} />
      </button>
    </form>
  );
}
