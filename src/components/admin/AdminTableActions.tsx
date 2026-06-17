import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

interface AdminTableActionsProps {
  editUrl: string;
  onDelete: () => void;
}

export default function AdminTableActions({ editUrl, onDelete }: AdminTableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
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
