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

  const createChannel = async ({ name }) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!name?.trim()) {
      alert('Please enter a channel name');
      return;
    }
    const payload = { channelName: name.trim() };
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
          err.response.data.errors?.msg) ||
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
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle menu"
            title="Menu"
          >
            {/* Hamburger icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-800">
              <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-red-600">Youtube</span>
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
            <button
              className="h-10 px-5 border rounded-r-full bg-gray-100 hover:bg-gray-200"
              title="Search"
            >
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
              {/* Desktop Create button */}
              <button
                onClick={() => setModalOpen(true)}
                className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full
                           bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                title="Create"
              >
                {/* Camera icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-900">
                  <path
                    fill="currentColor"
                    d="M17 10.5V7a2 2 0 0 0-2-2H5A2 2 0 0 0 3 7v10a2 
                       2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4Z"
                  />
                </svg>
                <span className="text-sm">Create</span>
                {/* Caret */}
                <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-700">
                  <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>

              {/* Username + logout */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-700">{user.username}</span>
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
          <button className="h-10 px-5 border rounded-r-full bg-gray-100">🔍</button>
        </div>
      </form>

      {/* Sidebar */}
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
