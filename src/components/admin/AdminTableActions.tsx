import Link from 'next/link';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

interface AdminTableActionsProps {
  editUrl: string;
  onDelete: () => void;
  previewUrl?: string;
}

export default function AdminTableActions({
  editUrl,
  onDelete,
  previewUrl,
}: AdminTableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Preview"
        >
          <ExternalLink size={18} />
        </a>
      )}
      <Link
        href={editUrl}
        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit"
      >
        <Edit size={18} />
      </Link>
      <button
        onClick={onDelete}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
