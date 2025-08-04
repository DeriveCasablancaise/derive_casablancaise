import { getPostById, getRelatedPosts } from '@/lib/actions/post.actions';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Calendar, Globe, LocateIcon } from 'lucide-react';
import { format, isEqual } from 'date-fns';
import { fr, arMA } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import VideoThumbnail from '@/components/shared/VideoThumbnail';
import SafeHtml from '@/components/shared/SafeHtml';
import ImageGallery from '@/components/shared/PostGallery';
import Contact from '@/components/shared/contact';
import ClientWrapper from '@/components/shared/PostWrapper';
import { ParentLink } from '@/components/shared/ParentLink'; // Import the new ParentLink component

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
          />

          {/* Title */}
          <h1
            className={cn(
              'text-2xl md:text-3xl lg:text-4xl mb-8 text-[#ee7103] px-4 font-normal',
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
              {/* Event Details - Directly Displayed */}
              <div className="space-y-4">
                {/* Location */}
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isArabic && 'flex-row-reverse justify-end'
                  )}
                >
                  <LocateIcon className="size-6 text-[#094142] font-bold" />
                  <p
                    className={cn(
                      'font-semibold text-[#094142]',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular'
                    )}
                  >
                    {isArabic ? 'موقع الحدث' : "Lieu de l'événement"}:{' '}
                    <span className="text-[#ee7103]">{post.location}</span>
                  </p>
                </div>

                {/* Date and Time */}
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isArabic && 'flex-row-reverse justify-end'
                  )}
                >
                  <Calendar className="size-6 text-[#094142] font-bold" />
                  <p
                    className={cn(
                      'font-semibold text-[#094142]',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular'
                    )}
                  >
                    {isArabic ? 'التاريخ والوقت' : 'Date et heure'}:{' '}
                    <span className="text-[#ee7103]">
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
              {/* Video Section - Mobile and Tablet */}
              {post.videoSource && (
                <div className="lg:hidden flex justify-center items-center">
                  <VideoThumbnail
                    thumbnailSrc={post.images[0]}
                    videoUrl={post.videoSource}
                  />
                </div>
              )}
            </div>
            {/* Right Column - Content */}
            <div className="lg:min-h-screen flex flex-col">
              <SafeHtml
                html={isArabic ? post.arabicText : post.frenchText}
                className={cn(
                  'max-w-none flex-1 flex flex-col justify-start gap-6',
                  isArabic
                    ? 'text-right arabic-subtitle-regular text-lg xl:text-2xl'
                    : 'latin-subtitle-regular text-lg xl:text-2xl'
                )}
              />
              {/* Video Section - Desktop */}
              {post.videoSource && (
                <div className="hidden lg:flex justify-center md:justify-end items-center mt-8">
                  <VideoThumbnail
                    thumbnailSrc={post.images[0]}
                    videoUrl={post.videoSource}
                  />
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
