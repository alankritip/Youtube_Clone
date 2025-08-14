
/**
 * @file HomePage.jsx
 * @description Displays video grid with category filter, search, and responsive layout.
 */

import { useState, useEffect } from 'react';
import MainHeader from '../components/layouts/MainHeader.jsx';
import NavSidebar from '../components/layouts/NavSidebar.jsx';
import CategoryFilters from '../components/filters/CategoryFilters.jsx';
import VideoPreviewCard from '../components/cards/VideoPreviewCard.jsx';
import api from '../api/axiosInstance.js';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos', {
        params: { q: searchQuery, category },
      });
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, category]);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <MainHeader
        onSearch={setSearchQuery}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <NavSidebar open={sidebarOpen} />

        <main className="flex-1">
          <CategoryFilters
            selected={category}
            onChange={setCategory}
          />

          <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {videos.map((v) => (
              <VideoPreviewCard key={v._id} v={v} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
