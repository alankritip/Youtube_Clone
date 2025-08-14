const CATEGORIES = ['All', 'Education', 'Music', 'Gaming', 'Tech', 'Comedy', 'News'];

export default function CategoryFilters({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto p-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1 rounded-full border ${cat === selected ? 'bg-black text-white' : 'bg-gray-100'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
