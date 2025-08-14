import { Link } from 'react-router-dom';

export default function NavSidebar({ open }) {
return (
<>
{/* Desktop rail */}
<aside className="hidden md:block bg-white border-r w-60 sticky top-14 h-[calc(100vh-56px)]">
<nav className="py-3">
<Link className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100" to="/">
<span>🏠</span><span>Home</span>
</Link>
<button className="w-full text-left flex items-center gap-4 px-4 py-2 hover:bg-gray-100">
<span>🎬</span><span>Shorts</span>
</button>
<button className="w-full text-left flex items-center gap-4 px-4 py-2 hover:bg-gray-100">
<span>📺</span><span>Subscriptions</span>
</button>
<hr className="my-3" />
<Link className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100" to="/channel/create">
<span>➕</span><span>Create Channel</span>
</Link>
</nav>
</aside>

  {/* Mobile drawer (simple version: toggled block) */}
  <aside className={`md:hidden fixed inset-y-0 left-0 z-50 bg-white border-r w-64 p-3 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
    <nav className="py-2">
      <Link className="block px-3 py-2 hover:bg-gray-100 rounded" to="/">Home</Link>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Shorts</button>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Subscriptions</button>
      <hr className="my-3" />
      <Link className="block px-3 py-2 hover:bg-gray-100 rounded" to="/channel/create">Create Channel</Link>
    </nav>
  </aside>

  {/* Backdrop for mobile */}
  {open && <div className="md:hidden fixed inset-0 z-40 bg-black/30" />}
</>
);
}