import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from '../sanitize';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const out = sanitizeHtml('<p>hi</p><script>alert(1)</script>');
    expect(out).toBe('<p>hi</p>');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeHtml('<p onclick="x()">a</p><img src="a.png" onerror="x()">');
    expect(out).not.toContain('onerror');
    expect(out).not.toContain('onclick');
  });

  it('strips javascript: and data: hrefs', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    expect(sanitizeHtml('<a href="data:text/html;base64,AAAA">x</a>')).not.toContain('data:');
  });

  it('keeps what tiptap emits', () => {
    const html =
      '<p style="text-align: center"><strong>bold</strong> <a href="https://example.com" target="_blank">link</a></p>';
    const out = sanitizeHtml(html);
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('text-align: center');
  });

  it('drops styles other than text-align', () => {
    const out = sanitizeHtml('<p style="color:red; position:fixed">a</p>');
    expect(out).not.toContain('style');
  });

  it('returns an empty string when there is no text or media', () => {
    expect(sanitizeHtml('<p></p>')).toBe('');
    expect(sanitizeHtml('<p><br></p>')).toBe('');
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('keeps content that has media but no text', () => {
    expect(sanitizeHtml('<p><img src="https://example.com/a.png"></p>')).toContain('<img');
  });
});
