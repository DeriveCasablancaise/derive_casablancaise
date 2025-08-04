'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import NextLink from 'next/link';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Instagram } from 'lucide-react';

const Contact = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Footer');

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-200, 0]);

  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const [maxBtnWidth, setMaxBtnWidth] = useState<number | null>(null);

  useEffect(() => {
    const btn1Width = btn1Ref.current?.offsetWidth || 0;
    const btn2Width = btn2Ref.current?.offsetWidth || 0;
    const maxWidth = Math.max(btn1Width, btn2Width);
    setMaxBtnWidth(maxWidth);
  }, []);

  const quickLinks = [
    {
      link: t('programme2024'),
      path: `/${locale}/derive-2024`,
    },
    {
      link: t('previousEditions'),
      path: `/${locale}/previous`,
    },

    {
      link: t('associationAR2D'),
      path: `/${locale}/ar2d`,
    },
  ];

  return (
    <motion.footer
      className="bg-[#094142] text-white xl:pb-16 h-full"
      style={{ y }}
      ref={container}
    >
      <div className="container mx-auto px-4 pt-36">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Quicklinks */}
          <div className="flex flex-col justify-center items-start">
            <h2
              className={cn(
                ' text-xl mb-4',
                isArabic ? ' arabic-subtitle-bold' : 'latin-subtitle-regular'
              )}
            >
              {t('quicklinks')}
            </h2>
            <ul className="space-y-1">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-white text-base hover:text-[#ee7103]"
                  >
                    {link.link}
                  </Link>
                </li>
              ))}
              <li>
                <NextLink
                  href="/darja-admin"
                  className="text-white text-base hover:text-[#ee7103]"
                >
                  {t('admin')}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h2
              className={cn(
                'text-xl mb-4',
                isArabic ? ' arabic-subtitle-bold' : 'latin-subtitle-regular'
              )}
            >
              {t('newsletterSignup')}
            </h2>
            <form className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="bg-transparent border-white text-white placeholder-white"
              />
              <Button
                className="bg-[#00b0db] text-[#2C4A4B] hover:bg-[#ee7103]"
                size="sm"
              >
                {t('subscribe')}
              </Button>
            </form>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col justify-center md:items-end">
            <h2
              className={cn(
                ' text-xl mb-4',
                isArabic ? ' arabic-subtitle-bold' : 'latin-subtitle-regular'
              )}
            >
              {t('followUs')}
            </h2>
            <Link
              href="https://www.instagram.com/derivecasablancaise"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-20 w-20" color="white" />
            </Link>
            {/* Contact */}
            <div className="mt-8">
              <Link
                href={`/${locale}/contact`}
                className={cn(
                  ' text-xl mb-4',
                  isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-regular'
                )}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center pb-6">
          <p className=" latin-subtitle-regular text-lg xl:text-2xl">
            Dérive Casablancaise 2024 ©
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Contact;
