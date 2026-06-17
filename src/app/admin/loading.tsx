export default function AdminLoading() {
  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        {/* Simple professional spinner */}
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <div className="text-slate-500 font-medium text-sm animate-pulse">Loading dashboard...</div>
      </div>
    </div>
  );
}
