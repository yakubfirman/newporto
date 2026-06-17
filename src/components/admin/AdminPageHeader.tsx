import Link from 'next/link';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 font-heading">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">{actionLabel}</span>
        </Link>
      )}
    </div>
  );
}
