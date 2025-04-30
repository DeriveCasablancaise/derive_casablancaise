import { Transition, Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';
type FadeInFunction = (direction: Direction, delay: number) => Variants;

export const fadeIn: FadeInFunction = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      opacity: 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -40 : 0,
      transition: {
        type: 'tween',
        duration: 1.5,
        delay: delay,
        ease: [0.25, 0.6, 0.3, 0.8],
      } as Transition, // Ensure correct typing for transition
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 1.4,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      } as Transition, // Ensure correct typing for transition
    },
  };
};
