import { getLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';
import SafeHtml from '@/components/shared/SafeHtml';
import Contact from '@/components/shared/contact';
import ClientWrapper from '@/components/shared/PostWrapper';
import { ParentLink } from '@/components/shared/ParentLink';
import ImageGallery from '@/components/shared/Derive2024/PostGallery';
import Artist from '@/lib/database/models/artist.model';
import SoundCloudEmbed from '@/components/shared/SoundCloudEmbed';
import { categoryHref, type EditionYear } from '@/constants/editions';
import { formatPostDates, getPostFields } from '@/lib/post-display';

export const getPostArtists = async (post: any) => {
  let artists: any[] = [];
  if (post.artists && post.artists.length > 0) {
    const fetchedArtists = await Artist.find({ _id: { $in: post.artists } });

    // 2. Create a Map for instant lookup by ID
    // We convert the ObjectId to string to ensure keys match
    const artistsMap = new Map(
      fetchedArtists.map((artist: any) => [artist._id.toString(), artist]),
    );

    // 3. Rebuild the array using the original order from 'post.artists'
    artists = post.artists
      .map((id: string) => artistsMap.get(id.toString()))
      .filter((artist: any) => artist !== undefined); // Safety check
  }

  return artists;
};

interface PostPageBodyProps {
  post: any;
  artists: any[];
  edition: EditionYear;
  // 2024 has extra space above the two columns, 2022 does not
  topSpacing?: boolean;
}

const PostPageBody = async ({
  post,
  artists,
  edition,
  topSpacing = false,
}: PostPageBodyProps) => {
  const locale = await getLocale();
  const isArabic = locale === 'ar';
  const { title, text, location } = getPostFields(post, locale);
  const dateText = formatPostDates(
    post.startDateTime,
    post.endDateTime,
    isArabic,
  );

  const galleryImages = [
    ...(post.thumbnailImage ? [post.thumbnailImage] : []),
    ...(post.images || []),
  ];

  return (
    <div className="overflow-hidden">
      <ClientWrapper>
        <div className="mx-auto py-8 pt-[20vh] pb-16">
          {/* Add the ParentLink component here */}
          <ParentLink
            label={isArabic ? 'العودة' : 'Retour'}
            className="px-4 mb-4"
            href={`/${locale}${categoryHref(edition, post.postCategory)}`}
          />

          {/* Title */}
          <h1
            className={cn(
              'text-xl lg:text-3xl text-[#ee7103] px-4 font-normal',
              title.isArabic ? 'arabic-title-bold text-right' : 'latin-title-light',
            )}
          >
            {title.value}
          </h1>

          {/* Artists */}
          {artists && artists.length > 0 && (
            <div className="px-4 py-2">
              <div
                className={cn(
                  'flex flex-wrap gap-2',
                  isArabic && 'justify-end',
                )}
              >
                {artists.map((artist: any, index: number) => (
                  <span
                    key={artist._id || index}
                    className={cn(
                      'inline-block text-black font-medium text-lg',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular',
                    )}
                  >
                    {isArabic ? artist.arabicName : artist.frenchName}
                    {index < artists.length - 1 && ' - '}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Two Column Layout */}
          <div
            className={cn(
              'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4',
              topSpacing && 'mt-12',
            )}
          >
            {/* Left Column - Image Gallery and Details */}
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="w-full">
                <ImageGallery
                  images={galleryImages}
                  alt={title.value}
                />
              </div>
              {/* Event Details - Responsive Layout */}
              <div className="space-y-4 lg:space-y-6">
                {/* Location and Date/Time - Same line on large screens */}
                <div className={cn('flex flex-col gap-4 ', isArabic && '')}>
                  {/* Location */}
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      location.isArabic &&
                        'flex-row-reverse justify-end lg:justify-start',
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-black',
                        location.isArabic
                          ? 'arabic-subtitle-regular'
                          : 'latin-subtitle-regular',
                      )}
                    >
                      {location.value}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      isArabic &&
                        'flex-row-reverse justify-end lg:justify-start',
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-[#094142]',
                        isArabic
                          ? 'arabic-subtitle-regular'
                          : 'latin-subtitle-regular',
                      )}
                    >
                      <span className="text-black">
                        {dateText}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Content */}
            <div className="lg:min-h-screen flex flex-col">
              <SafeHtml
                html={text.value}
                className={cn(
                  'max-w-none flex-1 flex flex-col justify-start gap-6',
                  text.isArabic
                    ? 'text-right arabic-subtitle-regular'
                    : 'latin-subtitle-regular',
                )}
              />

              {post.url && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p
                    className={cn(
                      'text-sm font-semibold mb-4 text-gray-600',
                      isArabic
                        ? 'arabic-subtitle-regular text-right'
                        : 'latin-subtitle-regular',
                    )}
                  >
                    {isArabic
                      ? 'استمع على SoundCloud'
                      : 'Écoutez sur SoundCloud'}
                  </p>
                  <SoundCloudEmbed url={post.url} />
                </div>
              )}
            </div>
          </div>
        </div>
      </ClientWrapper>
      <Contact />
    </div>
  );
};

export default PostPageBody;
