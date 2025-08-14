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
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>☰</button>
        <Link to="/" className="font-bold text-red-600 text-lg">TubeVista</Link>
      </div>
      <form onSubmit={submit} className="flex-1 flex max-w-lg mx-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search videos..."
          className="flex-1 border px-3 py-2 rounded-l"
        />
        <button className="bg-gray-100 border border-l-0 px-4 rounded-r">Search</button>
      </form>
      <div>
        {!user ? (
          <button onClick={() => navigate('/auth')} className="bg-red-600 text-white px-4 py-2 rounded">
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="hidden sm:block">Hi, {user.username}</span>
            <button onClick={logout} className="underline text-sm">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
