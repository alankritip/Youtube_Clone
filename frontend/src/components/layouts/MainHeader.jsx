/**
 * @file MainHeader.jsx
 * @description Displays the app logo, search bar, sign-in/out button.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MainHeader({ onSearch, toggleSidebar }) {
const [q, setQ] = useState('');
const { user, logout } = useAuth();
const navigate = useNavigate();

const submit = (e) => {
e.preventDefault();
onSearch?.(q.trim());
};

return (
<header className="sticky top-0 z-40 bg-white border-b">
<div className="h-14 px-4 flex items-center justify-between gap-3">
{/* Left: menu + logo */}
<div className="flex items-center gap-3">
<button className="p-2 rounded-full hover:bg-gray-100 md:hidden" onClick={toggleSidebar} aria-label="Toggle menu" >
☰
</button>
<Link to="/" className="flex items-center gap-1">
<span className="text-xl font-bold text-red-600">TubeVista</span>
<span className="text-xs text-gray-500 align-super">IN</span>
</Link>
</div>
       {/* Center: search (desktop) */}
    <form onSubmit={submit} className="flex-1 max-w-2xl mx-4 hidden md:flex">
      <div className="flex w-full">
        <input
          className="flex-1 h-10 px-4 border border-r-0 rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="h-10 px-5 border rounded-r-full bg-gray-100 hover:bg-gray-200">
          🔍
        </button>
      </div>
    </form>

    {/* Right: auth */}
    <div className="flex items-center gap-2">
      {!user ? (
        <button
          onClick={() => navigate('/auth')}
          className="h-9 px-4 border rounded-full text-blue-600 hover:bg-blue-50"
        >
          Sign in
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-700">
            {user.username}
          </span>
          <button onClick={logout} className="text-sm text-gray-600 hover:underline">
            Logout
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Mobile search */}
  <form onSubmit={submit} className="px-4 pb-3 md:hidden">
    <div className="flex">
      <input
        className="flex-1 h-10 px-4 border border-r-0 rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-300"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="h-10 px-5 border rounded-r-full bg-gray-100">🔍</button>
    </div>
  </form>
</header>
);
}