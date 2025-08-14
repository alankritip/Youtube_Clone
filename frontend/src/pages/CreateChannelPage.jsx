/**
 * @file CreateChannelPage.jsx
 * @description Allows authenticated users to create a new channel.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/layouts/MainHeader.jsx';
import api from '../api/axiosInstance.js';

export default function CreateChannelPage() {
  const [form, setForm] = useState({ channelName: '', description: '', channelBanner: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/channels', form);
    navigate(`/channel/${data._id}`);
  };

  return (
    <div>
      <MainHeader />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Create Channel</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Channel Name"
            value={form.channelName}
            onChange={(e) => setForm({ ...form, channelName: e.target.value })}
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Banner Image URL"
            value={form.channelBanner}
            onChange={(e) => setForm({ ...form, channelBanner: e.target.value })}
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-gray-900 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
    </div>
  );
}
