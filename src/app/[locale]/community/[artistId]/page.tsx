import { RelatedArtists } from '@/components/shared/artists/RelatedArtists';
import Contact from '@/components/shared/contact';
import ImageGallery from '@/components/shared/Derive2024/PostGallery';
import { ParentLink } from '@/components/shared/ParentLink';
import ClientWrapper from '@/components/shared/PostWrapper';
import {
  getArtistById,
  getRelatedArtists,
} from '@/lib/actions/artists.actions';
import { cn } from '@/lib/utils';
import { getLocale } from 'next-intl/server';
import React from 'react';

type ArtistProps = {
  params: {
    artistId: string;
  };
};

const page = async ({ params: { artistId } }: ArtistProps) => {
  const artist = await getArtistById(artistId);
  const locale = await getLocale();
  const isArabic = locale === 'ar';

  // Fetch related artists from the same category
  const relatedArtists = await getRelatedArtists({
    artistCategory: artist.artistCategory,
    artistId: artist._id,
  });

  return (
    <div className="overflow-hidden">
      <ClientWrapper>
        <div className=" mx-auto  py-8 pt-[20vh] pb-16">
          <ParentLink
            label={isArabic ? 'العودة' : 'Retour'}
            className="px-4 mb-4"
          />

          {/* Title */}
          <h1
            className={cn(
              'text-xl lg:text-3xl mb-8 text-[#ee7103] px-4',
              isArabic ? 'arabic-title-bold text-right' : 'latin-title-light'
            )}
          >
            {isArabic ? artist.arabicName : artist.frenchName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 px-4 gap-4">
            {/* Left Column - Image Gallery */}
            <ImageGallery
              images={artist.images}
              alt={isArabic ? artist.arabicName : artist.frenchName}
            />
            <p
              className={cn(
                'max-w-none flex flex-col items-center gap-8 px-4',
                isArabic
                  ? 'text-right arabic-subtitle-regular'
                  : 'latin-subtitle-regular'
              )}
            >
              {isArabic ? artist.arabicText : artist.frenchText}
            </p>
          </div>
        </div>
      </ClientWrapper>
      <Contact />
    </div>
  );
};

export default page;
