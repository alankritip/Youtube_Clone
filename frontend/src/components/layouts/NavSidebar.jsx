import { Link, useNavigate } from 'react-router-dom';

export default function NavSidebar({ open, user, onLogout, onClose, onCreateChannelClick }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white w-72 shadow transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-50`}
      aria-hidden={!open}
    >
      {/* Sidebar Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b">
        <span className="font-semibold">Menu</span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Sidebar Content */}
      <nav className="p-2 overflow-y-auto h-[calc(100%-56px)]">
        {/* Primary section */}
        <ul className="space-y-1 pb-3 border-b">
          <li>
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>🎬</span>
              <span>Shorts</span>
            </button>
          </li>
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>📺</span>
              <span>Subscriptions</span>
            </button>
          </li>
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>👤</span>
              <span>You</span>
            </button>
          </li>
        </ul>

        {/* Library section */}
        <ul className="space-y-1 py-3 border-b">
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>🕘</span>
              <span>History</span>
            </button>
          </li>

          {/* Navigate to Your Videos page */}
          <li>
            <button
              onClick={() => {
                navigate('/me/videos');
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>🎥</span>
              <span>Your videos</span>
            </button>
          </li>

          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>📝</span>
              <span>Watch later</span>
            </button>
          </li>
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>👍</span>
              <span>Liked videos</span>
            </button>
          </li>
        </ul>

        {/* Create channel quick action */}
        {user && (
          <div className="py-3 border-b">
            <button
              onClick={() => onCreateChannelClick?.()}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-black text-white hover:bg-black/90"
            >
              <span>➕</span>
              <span>Create channel</span>
            </button>
          </div>
        )}

        {/* Settings & Help */}
        <ul className="space-y-1 py-3">
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span>❓</span>
              <span>Help</span>
            </button>
          </li>
        </ul>

        {/* Authentication actions */}
        <div className="pt-2">
          {user ? (
            <button
              onClick={() => {
                onLogout?.();
                onClose?.();
              }}
              className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}
