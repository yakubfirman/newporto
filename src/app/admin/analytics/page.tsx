'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Eye, ThumbsUp, MessageSquare, FileText, TrendingUp, ExternalLink } from 'lucide-react';
import { fetchAdminAPI, Post } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';

interface AnalyticsData {
  overview: {
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_posts: number;
  };
  posts: Post[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAdminAPI<AnalyticsData>('/admin/analytics');
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchFn = useCallback((post: Post, search: string) => {
    return Boolean(post.title.toLowerCase().includes(search));
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedPosts,
    filteredItemsCount,
  } = useTablePagination(data?.posts || [], searchFn, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        description="Monitor your blog posts engagement and statistics"
      />

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Eye size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Total Views</div>
              <div className="text-2xl font-bold text-slate-800">{data.overview.total_views}</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
              <ThumbsUp size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Total Likes</div>
              <div className="text-2xl font-bold text-slate-800">{data.overview.total_likes}</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <MessageSquare size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Total Comments</div>
              <div className="text-2xl font-bold text-slate-800">
                {data.overview.total_comments}
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Total Posts</div>
              <div className="text-2xl font-bold text-slate-800">{data.overview.total_posts}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-500" />
          <h3 className="font-semibold text-slate-800">Post Engagement Report</h3>
        </div>
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search posts by title..."
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Post Title</th>
                <th className="px-6 py-4 font-semibold text-right">Views</th>
                <th className="px-6 py-4 font-semibold text-right">Likes</th>
                <th className="px-6 py-4 font-semibold text-right">Comments</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <p className="text-slate-600 font-medium">No posts found</p>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{post.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">/blog/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <Eye size={14} /> {post.views || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
                        <ThumbsUp size={14} /> {post.likes || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                        <MessageSquare size={14} /> {post.comments_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Post"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalItems={filteredItemsCount}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
