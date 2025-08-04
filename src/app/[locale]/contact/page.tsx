import React from 'react';
import ContactSection from '../../../components/shared/ContactPage';
import Contact from '@/components/shared/contact';

const ContactPage = () => {
  return (
    <div className="overflow-hidden">
      <ContactSection />
      <Contact />
    </div>
  );
};

export default ContactPage;
