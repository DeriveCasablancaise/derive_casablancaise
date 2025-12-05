'use client';

import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SoundCloudEmbedProps {
  url: string;
  className?: string;
  visual?: boolean;
}

export default function SoundCloudEmbed({
  url,
  className = '',
  visual = true,
}: SoundCloudEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedKey, setEmbedKey] = useState(0);

  const { embedUrl, isPlaylist } = useMemo(() => {
    if (!url || url.trim() === '') return { embedUrl: '', isPlaylist: false };

    try {
      let cleanUrl = url.trim();

      // Add https if missing
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // Parse the URL
      const urlObj = new URL(cleanUrl);

      // Validate SoundCloud domain
      if (!urlObj.hostname.includes('soundcloud.com')) {
        console.error('[v0] Invalid domain:', urlObj.hostname);
        return { embedUrl: '', isPlaylist: false };
      }

      // Check if it's a playlist (contains /sets/)
      const isPlaylist = urlObj.pathname.includes('/sets/');

      // Build clean URL without query parameters
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;

      console.log(
        '[v0] Extracted SoundCloud URL:',
        baseUrl,
        'Playlist:',
        isPlaylist
      );

      return { embedUrl: baseUrl, isPlaylist };
    } catch (error) {
      console.error('[v0] Invalid SoundCloud URL:', url, error);
      return { embedUrl: '', isPlaylist: false };
    }
  }, [url]);

  const height = useMemo(() => {
    if (isPlaylist) return '450';
    return visual ? '166' : '166';
  }, [isPlaylist, visual]);

  const embedSrc = useMemo(() => {
    if (!embedUrl) return '';

    // Build the embed URL with all necessary parameters
    const params = new URLSearchParams();
    params.set('url', embedUrl); // This will be properly URL-encoded
    params.set('color', 'ee7103');
    params.set('auto_play', 'false');
    params.set('hide_related', 'true');
    params.set('show_comments', 'false');
    params.set('show_user', 'true');
    params.set('show_reposts', 'false');
    params.set('show_teaser', 'false');
    params.set('visual', visual ? 'true' : 'false');

    const src = `https://w.soundcloud.com/player/?${params.toString()}`;
    console.log('[v0] Embed iframe src:', src);
    return src;
  }, [embedUrl, visual]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setEmbedKey((prev) => prev + 1);
  }, [embedUrl]);

  if (!embedUrl) {
    return (
      <div
        className={cn(
          'w-full p-6 bg-gray-50 border border-gray-200 rounded-lg',
          className
        )}
      >
        <p className="text-gray-500 text-sm text-center">
          URL SoundCloud invalide
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'w-full p-6 bg-gray-50 border border-gray-200 rounded-lg',
          className
        )}
      >
        <p className="text-gray-500 text-sm text-center">
          Impossible de charger le contenu SoundCloud
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full bg-white border-2 border-[#ee7103]/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      {isLoading && (
        <div
          className="w-full bg-gray-50 flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ee7103] rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-[#ee7103] rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 bg-[#ee7103] rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      )}
      <iframe
        key={embedKey}
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="0"
        allow="autoplay"
        src={embedSrc}
        className={cn('w-full', isLoading && 'hidden')}
        onLoad={() => {
          console.log('[v0] Iframe loaded successfully');
          setIsLoading(false);
        }}
        onError={() => {
          console.error('[v0] Iframe failed to load');
          setIsLoading(false);
          setHasError(true);
        }}
        title="SoundCloud player"
      />
    </div>
  );
}
