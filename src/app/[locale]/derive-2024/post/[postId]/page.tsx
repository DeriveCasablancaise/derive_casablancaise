import { getPostById, getRelatedPosts } from '@/lib/actions/post.actions';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Calendar, Globe, LocateIcon } from 'lucide-react';
import { format, isEqual } from 'date-fns';
import { fr, arMA } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import VideoThumbnail from '@/components/shared/VideoThumbnail';
import SafeHtml from '@/components/shared/SafeHtml';
import Contact from '@/components/shared/contact';
import ClientWrapper from '@/components/shared/PostWrapper';
import { ParentLink } from '@/components/shared/ParentLink'; // Import the new ParentLink component
import ImageGallery from '@/components/shared/Derive2024/PostGallery';

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
  const isArabic = locale === 'ar';

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
              'text-xl lg:text-3xl mb-8 text-[#ee7103] px-4 font-normal',
              isArabic ? 'arabic-title-bold text-right' : 'latin-title-light'
            )}
          >
            {isArabic ? post.arabicTitle : post.frenchTitle}
          </h1>
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
                <div
                  className={cn(
                    'flex flex-col gap-4 lg:flex-row lg:gap-8 lg:items-center',
                    isArabic && 'lg:flex-row-reverse lg:justify-end'
                  )}
                >
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

                {/* Artists */}
                {post.artists && post.artists.length > 0 && (
                  <div className="space-y-2">
                    <div
                      className={cn(
                        'flex flex-wrap gap-2',
                        isArabic && 'justify-end'
                      )}
                    >
                      {post.artists.map((artist: any, index: number) => (
                        <span
                          key={artist._id || index}
                          className={cn(
                            'inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm',
                            isArabic
                              ? 'arabic-subtitle-regular'
                              : 'latin-subtitle-regular'
                          )}
                        >
                          {isArabic ? artist.arabicName : artist.frenchName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
            </div>
          </div>
        </div>
      </ClientWrapper>
      <Contact />
    </div>
  );
};

export default page;
