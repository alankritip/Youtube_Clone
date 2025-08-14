import { Link } from 'react-router-dom';

export default function VideoPreviewCard({ v }) {
  return (
    <Link to={`/video/${v._id}`} className="block">
      <img src={v.thumbnailUrl} alt={v.title} className="w-full aspect-video object-cover rounded" />
      <div className="mt-1">
        <h3 className="font-medium line-clamp-2">{v.title}</h3>
        <p className="text-sm text-gray-600">{v?.channel?.channelName}</p>
        <p className="text-sm text-gray-600">{v.views} views</p>
      </div>
    </Link>
  );
}
