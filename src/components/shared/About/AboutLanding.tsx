'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

// Animation variants for text reveal
const descOpacity = {
  closed: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.4,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

const AboutLanding = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageContainerRef2 = useRef(null);
  const isInView = useInView(imageContainerRef);
  const isInView2 = useInView(imageContainerRef2);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on a smaller screen (e.g., mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ['start end', 'end end'],
  });

  // Create a zoom effect: scaling from 1 to 1.3 based on scroll position
  const backgroundSize = useTransform(
    scrollYProgress,
    [0.4, 1],
    isMobile ? ['cover', 'cover'] : ['100%', '130%']
  );

  return (
    <section ref={sectionRef} className="">
      {/* First Section - Introduction and Mission */}
      <motion.div
        ref={imageContainerRef}
        className="bg-derive bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 w-full min-h-screen relative py-24 lg:py-0 lg:mt-[10vh] flex flex-col lg:flex-row lg:items-center border-b-2 z-20"
        style={{
          backgroundSize,
        }}
      >
        {/* Left text box */}
        <motion.div
          className={cn(
            'lg:absolute lg:left-0 lg:top-0 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 shadow-xl',
            jakarta.className
          )}
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
        >
          <motion.p
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Les Rencontres de la Danse
          </motion.p>
          <motion.p
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Les Rencontres de la Danse (AR2D), fondée en 2002 et portée depuis
            par la danseuse et chorégraphe Meryem Jazouli, est une association
            dédiée à la création en danse contemporaine.
          </motion.p>
          <motion.p
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Elle joue un rôle essentiel dans l'évolution du paysage
            chorégraphique marocain à travers une programmation variée et des
            initiatives axées sur la diffusion, la formation, les échanges, les
            rencontres et la sensibilisation, accessibles à un large public.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Second Section - Espace DARJA and Current Activities */}
      <motion.div
        ref={imageContainerRef2}
        className="bg-derive2 bg-gradient-to-bl from-orange-400 via-red-500 to-pink-600 w-full min-h-screen relative py-8 flex flex-col lg:flex-row lg:items-center border-b-2 z-20"
        style={{
          backgroundSize,
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Right text box */}
        <motion.div
          className={cn(
            'lg:absolute lg:left-0 lg:-bottom-16 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:my-16 lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 order-2 shadow-xl',
            jakarta.className
          )}
          variants={descOpacity}
          animate={isInView2 ? 'open' : 'closed'}
        >
          <motion.p
            variants={descOpacity}
            animate={isInView2 ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Dérive Casablancaise
          </motion.p>
          <motion.p
            variants={descOpacity}
            animate={isInView2 ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Aujourd'hui, AR2D se concentre sur un programme pluridisciplinaire
            structuré sous forme de biennale, Dérive casablancaise, qui a pour
            ambition d'enrichir le dialogue artistique et d'établir des liens et
            collaborations entre artistes, publics et professionnels.
          </motion.p>
        </motion.div>

        {/* Left text box for current activities */}
        <motion.div
          className={cn(
            'lg:absolute lg:right-0 lg:-top-32 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 shadow-xl',
            jakarta.className
          )}
          variants={descOpacity}
          animate={isInView2 ? 'open' : 'closed'}
        >
          <motion.p
            variants={descOpacity}
            animate={isInView2 ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            L'Espace DARJA
          </motion.p>
          <motion.p
            variants={descOpacity}
            animate={isInView2 ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            En 2009, l'association inaugure à Casablanca l'Espace DARJA, un lieu
            ressource entièrement consacré à la danse contemporaine, devenant
            ainsi le centre névralgique de ses activités.
          </motion.p>
          <motion.p
            variants={descOpacity}
            animate={isInView2 ? 'open' : 'closed'}
            className={cn(
              'w-full font-bold text-[#094142] m-0',
              jakarta.className
            )}
          >
            Pendant dix ans, cet espace innovant servira à la fois de tremplin
            pédagogique pour les jeunes danseurs et de laboratoire
            d'expérimentation chorégraphique, proposant une programmation
            audacieuse qui élargit les horizons de l'art chorégraphique
            marocain.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutLanding;
