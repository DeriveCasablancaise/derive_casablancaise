import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className }) => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtml;
