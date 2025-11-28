'use client';

import { useMemo } from 'react';

interface SoundCloudEmbedProps {
  url: string;
  className?: string;
}

export default function SoundCloudEmbed({
  url,
  className = '',
}: SoundCloudEmbedProps) {
  // Extract SoundCloud track/playlist ID and create embed URL
  const embedUrl = useMemo(() => {
    if (!url) return '';

    try {
      // Handle various SoundCloud URL formats
      // Format 1: https://soundcloud.com/user/track-name
      // Format 2: https://soundcloud.com/user/sets/playlist-name
      // Format 3: Direct embed link or short links

      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      // For soundcloud.com URLs, return the URL as-is (widget will process it)
      if (urlObj.hostname.includes('soundcloud.com')) {
        return url;
      }

      return url;
    } catch (error) {
      console.error('[v0] Invalid SoundCloud URL:', error);
      return '';
    }
  }, [url]);

  if (!embedUrl) return null;

  return (
    <div className={`w-full ${className}`}>
      <iframe
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
          embedUrl
        )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
        style={{ borderRadius: '4px' }}
      />
    </div>
  );
}
