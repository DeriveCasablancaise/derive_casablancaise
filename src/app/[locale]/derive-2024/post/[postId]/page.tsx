import { getPostById, getRelatedPosts } from '@/lib/actions/post.actions';
import { getLocale } from 'next-intl/server';
import { format, isEqual } from 'date-fns';
import { fr, arMA } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import SafeHtml from '@/components/shared/SafeHtml';
import Contact from '@/components/shared/contact';
import ClientWrapper from '@/components/shared/PostWrapper';
import { ParentLink } from '@/components/shared/ParentLink'; // Import the new ParentLink component
import ImageGallery from '@/components/shared/Derive2024/PostGallery';
import Artist from '@/lib/database/models/artist.model';
import SoundCloudEmbed from '@/components/shared/SoundCloudEmbed';

type PostProps = {
  params: {
    postId: string;
  };
};

const page = async ({ params: { postId } }: PostProps) => {
  const post = await getPostById(postId);
  const relatedPosts = await getRelatedPosts({
    postCategory: post.postCategory,
    postId,
  });
  const locale = await getLocale();
  const hasArabicContent = post.arabicTitle && post.arabicText;
  const isArabic = locale === 'ar' && hasArabicContent;

  let artists: any[] = [];
  if (post.artists && post.artists.length > 0) {
    artists = await Artist.find({ _id: { $in: post.artists } });
  }

  const startDate = new Date(post.startDateTime);
  const endDate = new Date(post.endDateTime);
  const isSameDateTime = isEqual(startDate, endDate);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', {
      locale: isArabic ? arMA : fr,
    });
  };

  return (
    <div className="overflow-hidden">
      <ClientWrapper>
        <div className="mx-auto py-8 pt-[20vh] pb-16">
          {/* Add the ParentLink component here */}
          <ParentLink
            label={isArabic ? 'العودة' : 'Retour'}
            className="px-4 mb-4"
            href={`/${locale}/derive-2024/${post.postCategory}`}
          />

          {/* Title */}
          <h1
            className={cn(
              'text-xl lg:text-3xl text-[#ee7103] px-4 font-normal',
              isArabic ? 'arabic-title-bold text-right' : 'latin-title-light'
            )}
          >
            {isArabic ? post.arabicTitle : post.frenchTitle}
          </h1>

          {/* Artists */}
          {artists && artists.length > 0 && (
            <div className="px-4 py-2">
              <div
                className={cn(
                  'flex flex-wrap gap-2',
                  isArabic && 'justify-end'
                )}
              >
                {artists.map((artist: any, index: number) => (
                  <span
                    key={artist._id || index}
                    className={cn(
                      'inline-block text-black font-medium text-lg',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular'
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4">
            {/* Left Column - Image Gallery and Details */}
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="w-full">
                <ImageGallery
                  images={post.images}
                  alt={isArabic ? post.arabicTitle : post.frenchTitle}
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
                      isArabic &&
                        'flex-row-reverse justify-end lg:justify-start'
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-black',
                        isArabic
                          ? 'arabic-subtitle-regular'
                          : 'latin-subtitle-regular'
                      )}
                    >
                      {post.location}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      isArabic &&
                        'flex-row-reverse justify-end lg:justify-start'
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-[#094142]',
                        isArabic
                          ? 'arabic-subtitle-regular'
                          : 'latin-subtitle-regular'
                      )}
                    >
                      <span className="text-black">
                        {isSameDateTime ? (
                          <>
                            {format(new Date(post.startDateTime), 'PPP', {
                              locale: isArabic ? arMA : fr,
                            })}{' '}
                            {formatTime(startDate)}
                          </>
                        ) : (
                          <>
                            {format(new Date(post.startDateTime), 'PPP', {
                              locale: isArabic ? arMA : fr,
                            })}
                            {' - '}
                            {format(new Date(post.endDateTime), 'PPP', {
                              locale: isArabic ? arMA : fr,
                            })}
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Content */}
            <div className="lg:min-h-screen flex flex-col">
              <SafeHtml
                html={isArabic ? post.arabicText : post.frenchText}
                className={cn(
                  'max-w-none flex-1 flex flex-col justify-start gap-6',
                  isArabic
                    ? 'text-right arabic-subtitle-regular'
                    : 'latin-subtitle-regular'
                )}
              />

              {post.url && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p
                    className={cn(
                      'text-sm font-semibold mb-4 text-gray-600',
                      isArabic
                        ? 'arabic-subtitle-regular text-right'
                        : 'latin-subtitle-regular'
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

export default page;
