import { useState, useMemo } from 'react';

export default function CreateChannelModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const suggestedHandle = useMemo(() => {
    if (!name) return '';
    return (
      '@' +
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .slice(0, 20)
    );
  }, [name]);

  const displayHandle = handle || suggestedHandle;

  const submit = () => {
    if (!name.trim()) {
      alert('Please enter a channel name');
      return;
    }
    onCreate?.({
      name: name.trim(),
      handle: (displayHandle || '').replace(/^@/, '').toLowerCase(),
    });
    setName('');
    setHandle('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">How you’ll appear</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              className="text-gray-500"
            >
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6"
              />
            </svg>
          </div>
          <div className="w-full space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Channel name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700">Handle</label>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={suggestedHandle || '@yourhandle'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your handle is unique. It helps people find your channel.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-black/90"
          >
            Create channel
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          By clicking Create channel you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
