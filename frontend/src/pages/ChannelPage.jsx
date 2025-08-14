import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainHeader from '../components/layouts/MainHeader.jsx';
import VideoPreviewCard from '../components/cards/VideoPreviewCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axiosInstance.js';

export default function ChannelPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for create/edit form
  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch channel details + videos
  const fetchChannel = async () => {
    try {
      const { data } = await api.get(`/channels/${id}`);
      setData(data);
    } catch (err) {
      console.error('Failed to fetch channel:', err);
    }
  };

  useEffect(() => {
    fetchChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Delete video by ID
  const deleteVideo = async (vid) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/videos/${vid}`);
      fetchChannel();
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert(
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors?.msg) ||
        'Error deleting video.'
      );
    }
  };

  // Start editing a video (pre-fill form)
  const startEditing = (video) => {
    setEditingVideoId(video._id);
    setFormData({
      title: video.title || '',
      videoUrl: video.videoUrl || '',
      thumbnailUrl: video.thumbnailUrl || '',
      description: video.description || '',
      category: video.category || ''
    });
    setShowForm(true);
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      description: '',
      category: ''
    });
    setEditingVideoId(null);
    setShowForm(false);
  };

  // Submit create or edit
  const submitVideo = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.videoUrl.trim() || !formData.thumbnailUrl.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      videoUrl: formData.videoUrl.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim(),
      ...(formData.description ? { description: formData.description.trim() } : {}),
      ...(formData.category ? { category: formData.category.trim() } : {})
    };

    try {
      setLoading(true);

      if (editingVideoId) {
        await api.patch(`/videos/${editingVideoId}`, payload);
      } else {
        await api.post('/videos', { ...payload, channel: id });
      }

      resetForm();
      fetchChannel();
    } catch (err) {
      console.error('Failed to save video:', err);
      alert(
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors?.msg) ||
        'Error saving video.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div>Loading...</div>;

  const ownerId = data?.channel?.owner?._id || data?.channel?.owner || '';
  const isOwner = !!user && ownerId === user.id;

  return (
    <div>
      <MainHeader />
      <div className="max-w-6xl mx-auto p-4">
        <div
          className="h-48 bg-gray-200 mb-4"
          style={{
            backgroundImage: `url(${data.channel.channelBanner})`,
            backgroundSize: 'cover'
          }}
        ></div>

        <h1 className="text-2xl font-bold">{data.channel.channelName}</h1>
        <p className="mb-4">{data.channel.description}</p>

        {/* Owner-only create/edit toggle button */}
        {isOwner && (
          <div className="mb-3">
            <button
              onClick={() => {
                if (editingVideoId) {
                  resetForm();
                } else {
                  setShowForm((v) => !v);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
            >
              {showForm
                ? (editingVideoId ? 'Cancel edit' : 'Cancel')
                : '➕ Add Video'}
            </button>
          </div>
        )}

        {/* Create or Edit Video Form */}
        {isOwner && showForm && (
          <form
            onSubmit={submitVideo}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border space-y-4"
          >
            <input
              type="text"
              placeholder="Enter video title (min 3 characters)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="url"
              placeholder="Video URL (e.g. https://yourcdn.com/video.mp4)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="url"
              placeholder="Thumbnail URL (e.g. https://imagehost.com/thumb.jpg)"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Category (optional, e.g. Education, Music)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading
                ? (editingVideoId ? 'Updating...' : 'Uploading...')
                : (editingVideoId ? 'Update Video' : 'Upload Video')}
            </button>
          </form>
        )}

        {/* Video list */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(data.videos) && data.videos.length > 0 ? (
            data.videos.map((v) => (
              <div key={v._id} className="relative">
                <VideoPreviewCard v={v} />
                {isOwner && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => startEditing(v)}
                      className="bg-white border rounded px-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteVideo(v._id)}
                      className="bg-white border rounded px-2 text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-sm text-gray-600">
              No videos yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
