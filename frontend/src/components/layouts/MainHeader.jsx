/**
 * @file MainHeader.jsx
 * @description Displays app logo, search, auth buttons, and Create Channel button.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axiosInstance.js';
import CreateChannelModal from '../channel/CreateChannelModal.jsx';
import NavSidebar from './NavSidebar.jsx';

export default function MainHeader({ onSearch }) {
  const [q, setQ] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(q.trim());
  };

// Only the createChannel function changed
const createChannel = async ({ name, handle }) => {
  if (!user) {
    navigate('/auth');
    return;
  }
  if (!name?.trim()) {
    alert('Please enter a channel name');
    return;
  }

  const payload = {
    channelName: name.trim() // backend only needs this
  };

  try {
    const { data } = await api.post('/channels', payload);
    const id = data?._id;
    setModalOpen(false);

    if (id) {
      navigate(`/channel/${id}`);
    } else {
      alert('Channel created, but no ID returned!');
    }
  } catch (err) {
    console.error('Failed to create channel:', err);
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (Array.isArray(err?.response?.data?.errors) &&
        err.response.data.errors[0]?.msg) ||
      'Error creating channel. Please try again.';
    alert(message);
  }
};

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 "
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-red-600">Youtube</span>
            <span className="text-xs text-gray-500 align-super">IN</span>
          </Link>
        </div>

        {/* Center: search (desktop) */}
        <form
          onSubmit={submit}
          className="flex-1 max-w-2xl mx-4 hidden md:flex"
        >
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

        {/* Right: auth & create channel */}
        <div className="flex items-center gap-2">
          {!user ? (
            <button
              onClick={() => navigate('/auth')}
              className="h-9 px-4 border rounded-full text-blue-600 hover:bg-blue-50"
            >
              Sign in
            </button>
          ) : (
            <>
              {/* Desktop-only create button */}
              <button
                onClick={() => setModalOpen(true)}
                className="hidden md:inline-flex h-9 px-4 border rounded-full text-black hover:bg-gray-100"
              >
                Create channel
              </button>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-700">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
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
          <button className="h-10 px-5 border rounded-r-full bg-gray-100">
            🔍
          </button>
        </div>
      </form>

      {/* Mobile sidebar */}
      <NavSidebar
        open={sidebarOpen}
        user={user}
        onLogout={logout}
        onClose={() => setSidebarOpen(false)}
        onCreateChannelClick={() => {
          setSidebarOpen(false);
          setModalOpen(true);
        }}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createChannel}
      />
    </header>
  );
}
