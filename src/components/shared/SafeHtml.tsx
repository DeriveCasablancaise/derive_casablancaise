import React from 'react';
import { sanitizeHtml } from '@/lib/sanitize';

interface SafeHtmlProps {
  html?: string | null;
  className?: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
};

export default SafeHtml;
