'use client';

import { useInView, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import RoundedBtn from './rounded';
import Link from 'next/link';
import { sendEmail } from '../../lib/actions/sendEmail';
import { cn, descOpacity } from '../../lib/utils';
import ClientWrapper from './PostWrapper';

const ContactSection = () => {
  const t = useTranslations('ContactPage');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const container = useRef(null);
  const isInView = useInView(container);

  const [isNameFilled, setIsNameFilled] = useState(false);
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isMessageFilled, setIsMessageFilled] = useState(false);

  const [pending, setPending] = useState(false);

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFilledState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setFilledState(e.target.value !== '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await sendEmail(formData);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(t('success'));
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <ClientWrapper>
      <div className="bg-[#E9EAEB] min-h-screen lg:mt-[15vh] mb-24 contact-header">
        <div className="container medium">
          <div className="row will-change-transform">
            <div className="flex-col order-2 md:order-1 mb-32">
              <form onSubmit={handleSubmit} className="form">
                <div
                  className={`form-col ${isNameFilled ? 'not-empty' : ''} ${
                    isArabic ? 'arabic-text-bold' : 'latin-text-bold'
                  }`}
                >
                  <h5>01</h5>
                  <label htmlFor="senderName" className="label">
                    {' '}
                    {t('ContactForm.name')}{' '}
                  </label>
                  <input
                    type="text"
                    className="field font-normal"
                    id="form-name"
                    name="senderName"
                    required
                    onChange={(e) => handleInputChange(e, setIsNameFilled)}
                  />
                </div>
                <div
                  className={`form-col ${isEmailFilled ? 'not-empty' : ''} ${
                    isArabic ? 'arabic-text-bold' : 'latin-text-bold'
                  }`}
                >
                  <h5>02</h5>
                  <label htmlFor="senderEmail" className="label">
                    {' '}
                    {t('ContactForm.email')}{' '}
                  </label>
                  <input
                    type="email"
                    className="field font-normal"
                    id="form-email"
                    name="senderEmail"
                    required
                    onChange={(e) => handleInputChange(e, setIsEmailFilled)}
                  />
                </div>
                <div
                  className={`form-col ${isMessageFilled ? 'not-empty' : ''} ${
                    isArabic ? 'arabic-text-bold' : 'latin-text-bold'
                  }`}
                >
                  <h5>03</h5>
                  <label htmlFor="message" className="label">
                    {' '}
                    {t('ContactForm.message')}{' '}
                  </label>
                  <textarea
                    name="message"
                    maxLength={5000}
                    rows={8}
                    id="form-message"
                    className="field font-normal"
                    required
                    onChange={(e) => handleInputChange(e, setIsMessageFilled)}
                  />
                </div>
                <RoundedBtn
                  className={cn(
                    'group absolute top-[75%]  roundedBtnSize bg-[#094142] text-[#00b0db] rounded-full flex items-center justify-center cursor-pointer  mb-32 ',
                    isArabic
                      ? 'right-[calc(100%-200px)] md:right-[calc(100%-700px)] arabic-title-bold '
                      : 'left-[calc(100%-200px)] md:left-[calc(100%-700px)] latin-title-bold '
                  )}
                >
                  <button
                    type="submit"
                    className="w-full h-full flex items-center justify-center z-50 text-2xl"
                    disabled={pending}
                  >
                    {pending ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    ) : (
                      t('submitBtn')
                    )}
                  </button>
                </RoundedBtn>
              </form>
            </div>
            <div
              className={cn(
                'flex-col pt-[1.66em] text-[#094142] order-1 md:order-2 justify-center',
                isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
              )}
            >
              <h5 className={cn('opacity-30 ', isArabic ? 'text-2xl' : '')}>
                {' '}
                {t('info')}{' '}
              </h5>
              <ul className="links-wrap">
                <li>
                  <Link
                    href="mailto:derivecasablancaise@gmail.com"
                    target="_blank"
                    dir="ltr"
                    className="underline hover:translate-x-2 transition-all duration-300"
                  >
                    derivecasablancaise@gmail.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
};

export default ContactSection;
