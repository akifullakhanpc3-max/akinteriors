export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#F9F7F4] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
