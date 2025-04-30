'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import Project from './project';
import { useLocale, useTranslations } from 'next-intl';

interface Project {
  title: string;
  src: string;
}

const scaleAnimation = {
  initial: { scale: 0, x: '-50%', y: '-50%' },
  enter: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

export default function DeriveProjects() {
  const [view, setView] = useState<'grid' | 'table'>('grid'); // State for view toggle
  const [modal, setModal] = useState<{ active: boolean; index: number }>({
    active: false,
    index: 0,
  });
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);

  const xMoveContainer = useRef<(x: number) => void>();
  const yMoveContainer = useRef<(y: number) => void>();
  const xMoveCursor = useRef<(x: number) => void>();
  const yMoveCursor = useRef<(y: number) => void>();
  const xMoveCursorLabel = useRef<(x: number) => void>();
  const yMoveCursorLabel = useRef<(y: number) => void>();

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage.Work');
  const t2 = useTranslations('Derive2024');

  const DeriveProjects: Project[] = [
    { title: t('work1.title'), src: '14.png' },
    { title: t('work2.title'), src: '15.png' },
    { title: t('work3.title'), src: '31.png' },
    { title: t('work4.title'), src: '19.png' },
  ];

  useEffect(() => {
    if (modalContainer.current && cursor.current && cursorLabel.current) {
      xMoveContainer.current = gsap.quickTo(modalContainer.current, 'left', {
        duration: 0.8,
        ease: 'power3',
      });
      yMoveContainer.current = gsap.quickTo(modalContainer.current, 'top', {
        duration: 0.8,
        ease: 'power3',
      });
      xMoveCursor.current = gsap.quickTo(cursor.current, 'left', {
        duration: 0.5,
        ease: 'power3',
      });
      yMoveCursor.current = gsap.quickTo(cursor.current, 'top', {
        duration: 0.5,
        ease: 'power3',
      });
      xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, 'left', {
        duration: 0.45,
        ease: 'power3',
      });
      yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, 'top', {
        duration: 0.45,
        ease: 'power3',
      });
    }
  }, []);

  const moveItems = (x: number, y: number) => {
    xMoveContainer.current?.(x);
    yMoveContainer.current?.(y);
    xMoveCursor.current?.(x);
    yMoveCursor.current?.(y);
    xMoveCursorLabel.current?.(x);
    yMoveCursorLabel.current?.(y);
  };

  const manageModal = (
    active: boolean,
    index: number,
    x: number,
    y: number
  ) => {
    moveItems(x, y);
    setModal({ active, index });
  };

  return (
    <main
      onMouseMove={(e: MouseEvent) => {
        moveItems(e.clientX, e.clientY);
      }}
      className={cn(
        'flex flex-col items-center px-8 xl:px-32 mt-32 mb-0 md:my-32 '
      )}
    >
      <div
        className={cn(
          'max-w-[1400px] w-full flex flex-col items-center justify-center mb-16 '
        )}
      >
        <div
          style={{
            paddingInlineStart: 'clamp(2.5em, 8vw, 8em)',
          }}
          className="w-full my-4 xl:my-8 "
        >
          <h5
            className={cn(
              'text-lg text-[#696443]',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {t2('work')}
          </h5>
        </div>

        {DeriveProjects.map((project, index) => (
          <Project
            key={index}
            index={index}
            title={project.title}
            manageModal={manageModal}
          />
        ))}
      </div>

      <>
        <motion.div
          ref={modalContainer}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? 'enter' : 'closed'}
          className={cn(
            'w-[400px] h-[350px] fixed top-1/2 left-1/2 bg-white pointer-events-none overflow-hidden z-[3] '
          )}
        >
          <div
            style={{ top: index * -100 + '%' }}
            className={cn(
              'w-full h-full relative transition-[top] duration-500 ease-[cubic-bezier(0.76, 0, 0.24, 1)]'
            )}
          >
            {DeriveProjects.map((project, idx) => {
              const { src } = project;
              return (
                <div
                  className={cn(
                    'w-full h-full flex items-center justify-center'
                  )}
                  style={{ backgroundColor: '#00b0db' }}
                  key={`modal_${idx}`}
                >
                  <Image
                    src={`/images/${src}`}
                    width={300}
                    height={0}
                    alt="image"
                    className="h-auto"
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div
          ref={cursor}
          className={cn(
            'w-[80px] h-[80px] rounded-full bg-[#00b0db] text-white fixed z-[3] flex items-center justify-center text-lg font-light pointer-events-none '
          )}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? 'enter' : 'closed'}
        ></motion.div>
        <motion.div
          ref={cursorLabel}
          className={cn(
            'w-[80px] h-[80px] rounded-full bg-[#00b0db] text-white fixed z-[3] flex items-center justify-center text-lg font-light pointer-events-none bg-transparent ',
            isArabic ? 'arabic-title-bold text-2xl' : 'latin-title-bold'
          )}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? 'enter' : 'closed'}
        >
          {t('view')}
        </motion.div>
      </>
    </main>
  );
}
