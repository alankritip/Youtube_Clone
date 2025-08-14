import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/layouts/MainHeader.jsx';
import VideoPreviewCard from '../components/cards/VideoPreviewCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axiosInstance.js';

export default function YourVideosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    category: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchMyVideos = async () => {
    try {
      setLoading(true);
      // Backend should have endpoint: GET /api/videos/mine
      const { data } = await api.get('/videos/mine');
      setVideos(Array.isArray(data) ? data : (data?.videos || []));
    } catch (err) {
      console.error('Failed to fetch user videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMyVideos();
  }, [user, navigate]);

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
      setSaving(true);
      if (editingVideoId) {
        await api.patch(`/videos/${editingVideoId}`, payload);
      } else {
        alert('Use your channel page to upload new videos.');
        return;
      }
      resetForm();
      fetchMyVideos();
    } catch (err) {
      console.error('Failed to save video:', err);
      alert(
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors?.msg) ||
        'Error saving video.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (vid) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/videos/${vid}`);
      fetchMyVideos();
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert(
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors?.msg) ||
        'Error deleting video.'
      );
    }
  };

  return (
    <div>
      <MainHeader />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your videos</h1>

        {/* Edit inline form */}
        {showForm && (
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Videos grid */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(videos) && videos.length > 0 ? (
              videos.map((v) => (
                <div key={v._id} className="relative">
                  <VideoPreviewCard v={v} />
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
                </div>
              ))
            ) : (
              <div className="col-span-full text-sm text-gray-600">
                No videos found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
