/**
 * @file CreateChannelPage.jsx
 * @description Allows authenticated users to create a new channel.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance.js';
import CreateChannelModal from '../components/channel/CreateChannelModal.jsx';

export default function CreateChannelPage() {
  const [modalOpen, setModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async ({ name, handle }) => {
    if (!name?.trim()) {
      alert('Please enter a channel name');
      return;
    }

    // Normalize handle if provided
    const normalizedHandle = handle
      ? String(handle).toLowerCase().replace(/^@/, '')
      : undefined;

    // Payload expected by backend
    const payload = {
      channelName: name.trim(), // required field for backend
      name: name.trim(),        // optional duplicate for UI/consistency
      ...(normalizedHandle ? { handle: normalizedHandle } : {}),
    };

    try {
      setLoading(true);
      console.log('📤 Creating channel with payload:', payload);

      // IMPORTANT: backend is under /api prefix
      const { data } = await api.post('/channels', {
  channelName: name.trim()
});
      console.log('✅ Create channel response:', data);

      const id = data?._id || data?.channel?._id || data?.id;

      if (id) {
        navigate(`/channel/${id}`); // go directly to the channel page
      } else {
        alert('Channel created, but no ID returned!');
      }
    } catch (err) {
      console.error('❌ Failed to create channel:', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.errors) &&
          err.response.data.errors[0]?.msg) ||
        'Error creating channel. Please try again.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      <CreateChannelModal
        open={modalOpen}
        onClose={() => navigate(-1)}
        onCreate={handleCreate}
      />

      {loading && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          Creating channel...
        </div>
      )}
    </div>
  );
}
