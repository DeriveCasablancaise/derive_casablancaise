'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Component() {
  return (
    <div className="w-full flex flex-col py-6 px-2 mt-16 lg:mt-0 relative lg:absolute lg:top-[15vh]">
      {/* First Line */}
      <div className="flex flex-col justify-center items-center text-center font-semibold text-xl lg:text-3xl">
        <span className="text-[#ee7103] latin-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          Dérive Casablancaise
        </span>
        <span className="text-[#ee7103] latin-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          Rencontres des arts de la scène
        </span>
        <span>
          {' '}
          <Image
            src="/images/spiralTrans.png"
            className="rounded-full object-cover"
            alt="spirals"
            width={40}
            height={40}
          />
        </span>{' '}
        <span className="text-[#ee7103] mt-2 lg:mt-0 lg:ml-4 arabic-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          ملتقى فنون الأداء
        </span>
      </div>

      {/* Moving Text Animation */}
      <motion.div
        className="mt-6 2xl:mb-24 flex justify-center items-center text-center font-normal text-base md:text-lg whitespace-nowrap "
        whileHover={{ animationPlayState: 'paused' }}
        style={{
          display: 'flex',
          animation: 'scroll 15s linear infinite',
        }}
      >
        <span className="text-[#094142] latin-title-light">
          Biennale pluridisciplinaire :
          Danse/Musique/Théâtre/Cinéma/Lectures/Ateliers/Conférences/Rencontres
        </span>
      </motion.div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
