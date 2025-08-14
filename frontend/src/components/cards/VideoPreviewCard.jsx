import { Link } from 'react-router-dom';

export default function VideoPreviewCard({ v }) {
  // Safe date formatting
  const dateText = v?.createdAt || v?.uploadDate;
  let when = '';
  if (dateText) {
    const d = new Date(dateText);
    if (!isNaN(d.getTime())) {
      when = d.toLocaleDateString();
    }
  }

  const videoId = v?._id;
  const href = videoId ? `/video/${videoId}` : '#';

  return (
    <Link to={href} className="block group">
      <div className="relative">
        <img
          src={v?.thumbnailUrl || ''}
          alt={v?.title || ''}
          className="w-full aspect-video object-cover rounded-xl bg-gray-200"
        />
        {/* Duration badge - static placeholder */}
        <span className="absolute bottom-1 right-1 text-xs bg-black/80 text-white px-1.5 py-0.5 rounded">
          12:34
        </span>
      </div>

      <div className="mt-2 flex gap-3">
        {/* Placeholder avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:underline">
            {v?.title || ''}
          </h3>
          <div className="text-sm text-gray-600">
            <div>{v?.channel?.channelName || 'Unknown Channel'}</div>
            <div>
              {(v?.views ?? 0).toLocaleString()} views
              {when && ` - ${when}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
