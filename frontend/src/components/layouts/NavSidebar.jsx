import { Link } from 'react-router-dom';

export default function NavSidebar({ open, user, onLogout, onClose, onCreateChannelClick }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white w-64 shadow transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-50`}
    >
      <div className="p-4 space-y-4">
        <Link to="/" onClick={onClose} className="block font-semibold">
          Home
        </Link>

        {/* Show Create Channel for logged-in users on mobile */}
        {user && (
          <button
            onClick={onCreateChannelClick}
            className="w-full text-left rounded-lg px-4 py-2 bg-black text-white hover:bg-black/90"
          >
            Create channel
          </button>
        )}

        {user ? (
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full text-left rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            onClick={onClose}
            className="block rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
