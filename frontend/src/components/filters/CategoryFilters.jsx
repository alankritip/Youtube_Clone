const DEFAULTS = ['All', 'Education', 'Music', 'Gaming', 'Tech', 'Comedy', 'News'];

export default function CategoryFilters({ selected, onChange, categories = DEFAULTS }) {
  return (
    <div className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b">
      <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              c === selected ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onChange?.(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
