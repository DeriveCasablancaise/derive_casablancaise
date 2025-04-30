'use server';

import React from 'react';
import { Resend } from 'resend';
import ContactFormEmail from '../../../email/contact-form-email';
import { getErrorMessage, validateString } from '../utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get('senderEmail');
  const message = formData.get('message');
  const senderName = formData.get('senderName');

  // simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: 'Invalid sender email',
    };
  }
  if (!validateString(senderName, 500)) {
    return {
      error: 'Invalid sender name',
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: 'Invalid message',
    };
  }

  let data;
  try {
    data = await resend.emails.send({
      from: 'Derive Contact <onboarding@resend.dev>',
      to: 'derivecasablancaise@gmail.com',
      subject: 'Email Dérive Casablancaise',
      replyTo: senderEmail,
      react: React.createElement(ContactFormEmail, {
        message: message,
        senderEmail: senderEmail,
        senderName: senderName,
      }),
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
