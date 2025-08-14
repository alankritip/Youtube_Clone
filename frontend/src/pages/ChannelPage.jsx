/**
 * @file ChannelPage.jsx
 * @description Displays channel details and list of videos. Owner sees edit/delete options.
 */

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

  const fetchChannel = async () => {
    const { data } = await api.get(`/channels/${id}`);
    setData(data);
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const deleteVideo = async (vid) => {
    if (!window.confirm("Delete this video?")) return;
    await api.delete(`/videos/${vid}`);
    fetchChannel();
  };

  if (!data) return <div>Loading...</div>;
  const isOwner = user && data.channel.owner._id === user.id;

  return (
    <div>
      <MainHeader />
      <div className="max-w-6xl mx-auto p-4">
        <div className="h-48 bg-gray-200 mb-4" style={{ backgroundImage: `url(${data.channel.channelBanner})`, backgroundSize: 'cover' }}></div>
        <h1 className="text-2xl font-bold">{data.channel.channelName}</h1>
        <p className="mb-4">{data.channel.description}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.videos.map((v) => (
            <div key={v._id} className="relative">
              <VideoPreviewCard v={v} />
              {isOwner && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => navigate(`/video/${v._id}`)} className="bg-white border rounded px-2 text-xs">Edit</button>
                  <button onClick={() => deleteVideo(v._id)} className="bg-white border rounded px-2 text-xs text-red-600">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
