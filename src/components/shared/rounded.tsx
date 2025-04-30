import React, { useEffect, useRef } from 'react';
import Magnetic from './Magnetic';
import gsap from 'gsap';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string;
}

const RoundedBtn: React.FC<ButtonProps> = ({
  children,
  backgroundColor,
  ...attributes
}) => {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    // Initialize GSAP timeline
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(
        circle.current,
        { top: '-25%', width: '150%', duration: 0.4, ease: 'power3.in' },
        'enter'
      )
      .to(
        circle.current,
        { top: '-150%', width: '125%', duration: 0.25 },
        'exit'
      );
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current?.tweenFromTo('enter', 'exit');
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <Magnetic>
      <div
        className="rounded-full border border-gray-500 cursor-pointer relative flex items-center justify-center px-16 py-4"
        style={{ overflow: 'hidden' }}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes}
      >
        {children}
        <div
          ref={circle}
          style={{ backgroundColor }}
          className="w-full h-[150%] absolute rounded-[50%] top-[100%] "
        ></div>
      </div>
    </Magnetic>
  );
};

export default RoundedBtn;
