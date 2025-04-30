'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import TeaserModal from './VideoModal';

interface VideoThumbnailProps {
  thumbnailSrc: string;
  videoUrl: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailSrc,
  videoUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex justify-center items-center shadow-md cursor-pointer group md:w-[400px] xl:w-[800px] aspect-video"
        onClick={openModal}
      >
        <Image
          src={thumbnailSrc}
          width={600}
          height={600}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
        <PlayCircle className="size-12 absolute top-1/2 left-1/2 text-[#094142] transition-all group-hover:scale-110 duration-700 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </motion.div>
      <TeaserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        videoUrl={videoUrl}
      />
    </>
  );
};

export default VideoThumbnail;
